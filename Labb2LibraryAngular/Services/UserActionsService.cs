using AutoMapper;
using FinalProjectLibrary.Data;
using FinalProjectLibrary.Helpers.Enums;
using FinalProjectLibrary.Models;
using FinalProjectLibrary.Models.Books;
using FinalProjectLibrary.Models.History;
using FinalProjectLibrary.Models.Users;
using FinalProjectLibrary.Models.Users.UserDTOs;
using FinalProjectLibrary.Repositories;
using FinalProjectLibrary.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace FinalProjectLibrary.Services
{
    public interface IUserActionsService
    {
        // Register methods
        Task<APIResponse<CreateUserDto>> AddUserAsync(CreateUserDto createUserDTO);
        // Reservation methods
        Task<APIResponse<List<ReservationItemDto>>> GetReservedBooksAsync(string userId);
        Task<APIResponse<UserDto>> ReserveBookAsync(string userId, int bookId);
        Task<APIResponse<UserDto>> CancelReservationAsync(string userId, int bookId);

        // Borrow methods
        Task<APIResponse<List<CheckedOutItemDto>>> GetCheckedOutBooksAsync(string userId);
        Task<APIResponse<UserDto>> CheckOutBookAsync(string userId, int bookId);
        Task<APIResponse<UserDto>> ReturnBookAsync(string userId, int bookId);
        // ReviewItem methods
        Task<APIResponse<List<ReviewItemDto>>> GetUserReviewsAsync(string userId);
        Task<APIResponse<CreateReviewItemDto>> CreateReviewAsync(CreateReviewItemDto reviewItemDto);
        Task<APIResponse<ReviewItemDto>> EditReviewAsync(int reviewId, ReviewItemDto reviewItemDto);
        Task<APIResponse<ReviewItemDto>> RemoveReviewItemAsync(int reviewId);
        Task<APIResponse<RatingItemDto>> EditRatingAsync(int reviewId, RatingItemDto ratingItemDto);
        Task<APIResponse<RatingItemDto>> RemoveRatingAsync(int reviewId);

        // FavoriteItem methods
        Task<APIResponse<List<FavoriteItemDto>>> GetFavoriteItemsAsync(string userId);
        Task<APIResponse<FavoriteItemDto>> AddToFavoritesAsync(string userId, int bookId);
        Task<APIResponse<FavoriteItemDto>> RemoveFromFavoritesAsync( string userId, int bookId);
    }

    public class UserActionsService : IUserActionsService
    {
        private readonly IUserRepo _userRepo;
        private readonly IBookRepo _bookRepo;
        private readonly IMapper _mapper;
        private readonly IBookService _bookService;
        private readonly AppDbContext _dbContext;
        private readonly UserManager<User> _userManager;
        private readonly IEmailService _emailService;

        public UserActionsService(IUserRepo userRepo, IBookRepo bookRepo, IMapper mapper, IBookService bookService, AppDbContext dbContext, UserManager<User> userManager, IEmailService emailService)
        {
            _userRepo = userRepo;
            _bookRepo = bookRepo;
            _mapper = mapper;
            _bookService = bookService;
            _dbContext = dbContext;
            _userManager = userManager;
            _emailService = emailService;
        }
        //Register methods
        public async Task<APIResponse<CreateUserDto>> AddUserAsync(CreateUserDto createUserDTO)
        {
            var response = new APIResponse<CreateUserDto>
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest
            };
            CheckIfExists(createUserDTO.Email, createUserDTO.UserName);

            var user = _mapper.Map<User>(createUserDTO);
            // Create user with password
            var result = await _userManager.CreateAsync(user, createUserDTO.Password);
            if (!result.Succeeded)
            {
                response.ErrorMessages.AddRange(result.Errors.Select(e => e.Description));
                return response;
            }
            await _userManager.AddToRoleAsync(user, Roles.User);
            await _emailService.SendRegistrationEmailAsync(
                createUserDTO.Email,
                createUserDTO.FirstName,
                createUserDTO.UserName,
                createUserDTO.Password
            );

            var createdUserDto = _mapper.Map<CreateUserDto>(user);
            response.IsSuccess = true;
            response.StatusCode = HttpStatusCode.Created;
            response.Result = createdUserDto;
            return response;
        }
        private void CheckIfExists(string email, string userName)
        {
            var user = _userRepo.GetByEmailAsync<User>(email).Result;
            if (user != null)
            {
                throw new Exception("Email already exists.");
            }
            var userNameExists = _userRepo.GetByUserNameAsync<User>(userName).Result;
            if (userNameExists != null)
            {
                throw new Exception("UserName already exists.");
            }
        }
        // Reservation methods
        public async Task<APIResponse<List<ReservationItemDto>>> GetReservedBooksAsync(string userId)
        {
            var response = new APIResponse<List<ReservationItemDto>>
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest
            };

            // Check if user exists
            var user = await _userRepo.GetByIdAsync<User>(userId);
            if (user == null)
            {
                response.ErrorMessages.Add("User not found.");
                response.StatusCode = HttpStatusCode.NotFound;
                return response;
            }

            // Query ReservationItems directly and include the Book
            var reservations = await _dbContext.ReservationItems
                .Where(r => r.UserId == userId)
                .Include(r => r.Book)
                .OrderByDescending(r => r.ReservationDate)
                .ToListAsync();

            // Map to DTOs
            var reservationDtos = _mapper.Map<List<ReservationItemDto>>(reservations);

            response.IsSuccess = true;
            response.StatusCode = HttpStatusCode.OK;
            response.Result = reservationDtos;
            return response;
        }
        public async Task<APIResponse<UserDto>> ReserveBookAsync(string userId, int bookId)
        {
            var response = new APIResponse<UserDto>
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest
            };

            var user = await _userRepo.GetByIdAsync<User>(userId);
            var book = await _bookRepo.GetByIdAsync(bookId);

            if (user == null || book == null)
            {
                response.ErrorMessages.Add("User or Book not found.");
                response.StatusCode = HttpStatusCode.NotFound;
                return response;
            }


            if (user != null && book != null)
            {
                if (user.ReservedBooks.Any(r => r.BookId == book.BookId))
                {
                    response.ErrorMessages.Add("Book already reserved by user.");
                    response.StatusCode = HttpStatusCode.Conflict;
                    return response;
                }
                else if (user.CheckedOutBooks.Any(b => b.BookId == book.BookId))
                {
                    response.ErrorMessages.Add("Book already checked out by user.");
                    response.StatusCode = HttpStatusCode.Conflict;
                    return response;
                }
                ;

                AddReservation(user, book);

                await _bookService.UpdateBookStatusAsync(book, user.Id, BookStatusEnum.Reserved, $"Book reserved by {user.UserName}"); // Update the book status to Reserved

                await _dbContext.SaveChangesAsync();

                response.IsSuccess = true;
                response.StatusCode = HttpStatusCode.OK;
                response.Result = _mapper.Map<UserDto>(user);
            }
            else
            {
                response.ErrorMessages.Add("User or Book not found.");
                response.StatusCode = HttpStatusCode.NotFound;
            }

            return response;
        }
        private void AddReservation(User user, Book book)
        {
            var reservation = new ReservationItem
            {
                BookId = book.BookId,
                Book = book,
                BookIsAvaliableEmailSent = null,
                AvailabilityDate = null, // Will be set after calculation
                UserId = user.Id,
                User = user,
                ReservationDate = DateTime.UtcNow
            };
            user.ReservedBooks.Add(reservation);
            book.Reservations.Add(reservation);
            _dbContext.ReservationItems.Add(reservation);

            // Now update all availability dates, including the new reservation
            _bookService.SetAvailabilityDatesForReservations(book).Wait();

            // The reservation.AvailabilityDate is now set correctly
        }

        public bool RemoveReservation(User user, Book book)
        {
            // Find the reservation item for the given book
            var reservationItem = user.ReservedBooks.FirstOrDefault(r => r.BookId == book.BookId);
            if (reservationItem != null)
            {
                // Remove the reservation from both the user and the book
                user.ReservedBooks.Remove(reservationItem);
                book.Reservations.Remove(reservationItem);
                _dbContext.ReservationItems.Remove(reservationItem);

                // Update all availability dates for remaining reservations
                _bookService.SetAvailabilityDatesForReservations(book).Wait();

                return true;
            }

            return false;
        }

        public async Task<APIResponse<UserDto>> CancelReservationAsync(string userId, int bookId)
        {
            var response = new APIResponse<UserDto>
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest
            };

            var bookResponse = await _bookService.GetBookByIdAsync(bookId);
            var user = await _userRepo.GetByIdAsync<User>(userId);
            var book = bookResponse.Result;



            if (user != null && book != null)
            {
                // Use the refactored RemoveReservation method
                if (RemoveReservation(user, book))
                {
                    await _bookService.UpdateBookStatusAsync(book, user.Id, BookStatusEnum.Available, $"Reservation cancelled by {user.UserName}");

                    await _userRepo.SaveAsync();
                    await _bookRepo.SaveAsync();


                    response.IsSuccess = true;
                    response.StatusCode = HttpStatusCode.OK;
                    response.Result = _mapper.Map<UserDto>(user); 
                }
                else
                {
                    response.ErrorMessages.Add("Book not reserved by user.");
                    response.StatusCode = HttpStatusCode.Conflict;
                }
            }
            else
            {
                response.ErrorMessages.Add("User or Book not found.");
                response.StatusCode = HttpStatusCode.NotFound;
            }

            return response;
        }

        // Borrow methods
        public async Task<APIResponse<List<CheckedOutItemDto>>> GetCheckedOutBooksAsync(string userId)
        {
            var response = new APIResponse<List<CheckedOutItemDto>>
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest
            };
            var user = await _userRepo.GetByIdAsync<User>(userId);
            if (user == null)
            {
                response.ErrorMessages.Add("User not found.");
                response.StatusCode = HttpStatusCode.NotFound;
                return response;
            }
            var checkedOutBooks = await _dbContext.CheckOutItems
                .Where(r => r.UserId == userId)
                .Include(r => r.Book)
                .OrderByDescending(r => r.CheckOutDate)
                .ToListAsync();

            // Map to DTOs
            var checkedOutDtos = _mapper.Map<List<CheckedOutItemDto>>(checkedOutBooks);

            response.IsSuccess = true;
            response.StatusCode = HttpStatusCode.OK;
            response.Result = checkedOutDtos;
            return response;
        }

        public async Task<APIResponse<UserDto>> CheckOutBookAsync(string userId, int bookId)
        {
            var response = new APIResponse<UserDto>
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest
            };


            var bookResponse = await _bookService.GetBookByIdAsync(bookId);
            var user = await _userRepo.GetByIdAsync<User>(userId);
            var book = bookResponse.Result;


            if (user != null && book != null)
            {
                // Check if the book is reserved by the user
                if (RemoveReservation(user, book) || book.BookStatus == BookStatusEnum.Available)
                {
                    SetCheckedOutBookAsync(user, book);
                    await _bookService.UpdateBookStatusAsync(book, user.Id, BookStatusEnum.CheckedOut, $"Checked out by {user.UserName}");
                }

                else
                {
                    response.ErrorMessages.Add("Book is not available to check out.");
                    response.StatusCode = HttpStatusCode.Conflict;
                    return response;
                }

                await _userRepo.UpdateAsync(user);
                await _userRepo.SaveAsync();

                var userDto = _mapper.Map<UserDto>(user);
                response.IsSuccess = true;
                response.StatusCode = HttpStatusCode.OK;
                response.Result = userDto;
            }
            else
            {
                response.ErrorMessages.Add("User or Book not found.");
                response.StatusCode = HttpStatusCode.NotFound;
            }

            return response;
        }
        public void SetCheckedOutBookAsync(User user, Book book)
        {
            var checkedOutItem = new CheckedOutItem
            {
                BookId = book.BookId,
                UserId = user.Id,
                CheckOutDate = DateTime.UtcNow,
                ReturnDate = DateTime.UtcNow.AddMonths(1),
            };
            user.CheckedOutBooks.Add(checkedOutItem);
            book.CheckedOutBy = checkedOutItem;
        }

        public async Task<APIResponse<UserDto>> ReturnBookAsync(string userId, int bookId)
        {
            var response = new APIResponse<UserDto>
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest
            };

            var bookResponse = await _bookService.GetBookByIdAsync(bookId);
            var user = await _userRepo.GetByIdAsync<User>(userId);
            var book = bookResponse.Result;

            if (user != null && book != null)
            {
                if (user.CheckedOutBooks.Any(c => c.BookId == book.BookId))
                {
                    RemoveFromCheckedOutList(user, book);
                }
                await _bookService.UpdateBookStatusAsync(book, user.Id, BookStatusEnum.Returned, $"Returned by {user.UserName}");

                await _userRepo.SaveAsync();
                await _bookRepo.SaveAsync();

                response.IsSuccess = true;
                response.StatusCode = HttpStatusCode.OK;
                response.Result = _mapper.Map<UserDto>(user);
            }
            else
            {
                response.ErrorMessages.Add("User or Book not found.");
                response.StatusCode = HttpStatusCode.NotFound;
            }

            return response;
        }
        public bool RemoveFromCheckedOutList(User user, Book book)
        {
            // Find the reservation item for the given book
            var checkedOutItem = user.CheckedOutBooks.FirstOrDefault(r => r.BookId == book.BookId);
            if (checkedOutItem != null)
            {
                // Remove the reservation from both the user and the book
                user.CheckedOutBooks.Remove(checkedOutItem);
                book.CheckedOutBy = null;

                _dbContext.CheckOutItems.Remove(checkedOutItem);

                return true;
            }

            return false;
        }
        // RewviewItem methods

        public async Task<APIResponse<List<ReviewItemDto>>> GetUserReviewsAsync(string userId)
        {
            var response = new APIResponse<List<ReviewItemDto>>
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest
            };
            var user = await _userRepo.GetByIdAsync<User>(userId);
            if (user == null)
            {
                response.ErrorMessages.Add("User not found.");
                response.StatusCode = HttpStatusCode.NotFound;
                return response;
            }
            if (user.Reviews == null || !user.Reviews.Any())
            {
                response.ErrorMessages.Add("No reviews found for this user.");
                response.StatusCode = HttpStatusCode.NotFound;
                return response;
            }

            var reviewDtos = _mapper.Map<List<ReviewItemDto>>(user.Reviews);
            response.IsSuccess = true;
            response.StatusCode = HttpStatusCode.OK;
            response.Result = reviewDtos;
            return response;
        }
        public async Task<APIResponse<CreateReviewItemDto>> CreateReviewAsync(CreateReviewItemDto reviewItemDto)
        {
            var response = new APIResponse<CreateReviewItemDto>
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest
            };
            var user = _userRepo.GetByIdAsync<User>(reviewItemDto.UserId).Result;
            var book = _bookRepo.GetByIdAsync(reviewItemDto.BookId).Result;
            var newReview = new ReviewItem
            {
                BookId = book.BookId,
                UserId = user.Id,
                CreatedAt = reviewItemDto.CreatedAt,
                ReviewHeader = reviewItemDto.ReviewHeader,
                ReviewText = reviewItemDto.ReviewText
            };
            // Add review to context and save to get Id
            _dbContext.Add(newReview);
            user.Reviews.Add(newReview);
            book.Reviews.Add(newReview);
            await _dbContext.SaveChangesAsync();

            // If a rating is provided, create RatingItem and link it
            if (reviewItemDto.RatingItem != null)
            {
                var rating = _mapper.Map<RatingItem>(reviewItemDto.RatingItem);
                rating.ReviewItemId = newReview.Id; // Set the FK after review is saved
                _dbContext.Add(rating);
                await _dbContext.SaveChangesAsync();

                newReview.RatingItem = rating;
            }
            // Map back to DTO for response
            var resultDto = _mapper.Map<CreateReviewItemDto>(newReview);
            response.IsSuccess = true;
            response.StatusCode = HttpStatusCode.Created;
            response.Result = resultDto;
            return response;
        }
        public async Task<APIResponse<ReviewItemDto>> EditReviewAsync(int reviewId, ReviewItemDto reviewItemDto)
        {
            var response = new APIResponse<ReviewItemDto>
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest
            };
            var user = _userRepo.GetByIdAsync<User>(reviewItemDto.UserId).Result;
            var book = _bookRepo.GetByIdAsync(reviewItemDto.BookId).Result;
            var reviewToEdit = await _dbContext.ReviewItems.FindAsync(reviewId);

            if (reviewToEdit != null)
            {
                reviewToEdit.ReviewHeader = reviewItemDto.ReviewHeader;
                reviewToEdit.ReviewText = reviewItemDto.ReviewText;
                await _dbContext.SaveChangesAsync();
                response.IsSuccess = true;
                response.StatusCode = HttpStatusCode.OK;
                response.Result = _mapper.Map<ReviewItemDto>(reviewToEdit);
            }
            else
            {
                response.ErrorMessages.Add("Review item not found.");
                response.StatusCode = HttpStatusCode.NotFound;
            }
            return response;
        }
        public async Task<APIResponse<ReviewItemDto>> RemoveReviewItemAsync(int reviewId)
        {
            var response = new APIResponse<ReviewItemDto>
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest
            };
            var reviewToDelete = await _dbContext.ReviewItems
                .Include(r => r.User)
                .Include(r => r.Book)
                .FirstOrDefaultAsync(r => r.Id == reviewId);
            if (reviewToDelete != null)
            {
                // Remove from User's Reviews
                if (reviewToDelete.User != null)
                    reviewToDelete.User.Reviews.Remove(reviewToDelete);

                // Remove from Book's Reviews
                if (reviewToDelete.Book != null)
                    reviewToDelete.Book.Reviews.Remove(reviewToDelete);

                // Remove from DbContext
                _dbContext.ReviewItems.Remove(reviewToDelete);

                await _dbContext.SaveChangesAsync();

                response.IsSuccess = true;
                response.StatusCode = HttpStatusCode.OK;
                response.Result = _mapper.Map<ReviewItemDto>(reviewToDelete);
            }
            else
            {
                response.ErrorMessages.Add("Review item not found.");
                response.StatusCode = HttpStatusCode.NotFound;
            }
            return response;
        }
        public async Task<APIResponse<RatingItemDto>> EditRatingAsync(int reviewId, RatingItemDto ratingItemDto)
        {
            var response = new APIResponse<RatingItemDto>
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest
            };

            // Find the review by ReviewItemId
            var reviewToEdit = await _dbContext.Set<ReviewItem>()
                .Include(r => r.RatingItem)
                .FirstOrDefaultAsync(r => r.Id == reviewId);

            if (reviewToEdit == null || reviewToEdit.RatingItem == null)
            {
                response.ErrorMessages.Add("Review or Rating not found.");
                response.StatusCode = HttpStatusCode.NotFound;
                return response;
            }

            // Validate the rating range (optional, for immediate feedback)
            if (ratingItemDto.Rating < 0 || ratingItemDto.Rating > 10)
            {
                response.ErrorMessages.Add("Rating must be between 0 and 10.");
                response.StatusCode = HttpStatusCode.BadRequest;
                return response;
            }

            // Update the rating
            reviewToEdit.RatingItem.Rating = ratingItemDto.Rating;
            // Optionally update the timestamp
            reviewToEdit.RatingItem.CreatedAt = DateTime.UtcNow;

            await _dbContext.SaveChangesAsync();

            // Map back to DTO
            var resultDto = _mapper.Map<RatingItemDto>(reviewToEdit.RatingItem);
            response.IsSuccess = true;
            response.StatusCode = HttpStatusCode.OK;
            response.Result = resultDto;
            return response;
        }
        public async Task<APIResponse<RatingItemDto>> RemoveRatingAsync(int reviewId)
        {
            var response = new APIResponse<RatingItemDto>
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest
            };
            var review = await _dbContext.ReviewItems
                .Include(r => r.User)
                .Include(r => r.Book)
                .Include(r => r.RatingItem)
                .FirstOrDefaultAsync(r => r.Id == reviewId);

            if (review == null || review.RatingItem == null)
            {
                response.ErrorMessages.Add("Rating not found.");
                response.StatusCode = HttpStatusCode.NotFound;
                return response;
            }

            // Remove the RatingItem from the DbContext
            _dbContext.RatingItems.Remove(review.RatingItem);

            // Set the navigation property to null
            review.RatingItem = null;

            await _dbContext.SaveChangesAsync();

            response.IsSuccess = true;
            response.StatusCode = HttpStatusCode.OK;
            response.Result = null; // Rating is deleted, so return null
            return response;
        }

        // FavoriteItem methods
        public async Task<APIResponse<List<FavoriteItemDto>>> GetFavoriteItemsAsync(string userId)
        {
            var response = new APIResponse<List<FavoriteItemDto>>
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest
            };
            var user = await _userRepo.GetByIdAsync<User>(userId);
            if (user == null)
            {
                response.ErrorMessages.Add("User not found.");
                response.StatusCode = HttpStatusCode.NotFound;
                return response;
            }
            if (user.ReadList == null || !user.ReadList.Any())
            {
                response.ErrorMessages.Add("No favorites found for this user.");
                response.StatusCode = HttpStatusCode.NotFound;
                return response;
            }

            var favoriteDtos = _mapper.Map<List<FavoriteItemDto>>(user.ReadList);
            response.IsSuccess = true;
            response.StatusCode = HttpStatusCode.OK;
            response.Result = favoriteDtos;
            return response;
        }
        public async Task<APIResponse<FavoriteItemDto>> AddToFavoritesAsync(string userId, int bookId)
        {
            var response = new APIResponse<FavoriteItemDto>
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest
            };

            var user = await _userRepo.GetByIdAsync<User>(userId);
            var book = await _bookRepo.GetByIdAsync(bookId);

            if (user == null || book == null)
            {
                response.ErrorMessages.Add("User or Book not found.");
                response.StatusCode = HttpStatusCode.NotFound;
                return response;
            }

            // Prevent duplicates
            if (user.ReadList.Any(f => f.BookId == bookId))
            {
                response.ErrorMessages.Add("Book already in favorites.");
                response.StatusCode = HttpStatusCode.Conflict;
                return response;
            }

            var newFavorite = new FavoriteItem
            {
                BookId = book.BookId,
                UserId = user.Id,
                CreatedAt = DateTime.UtcNow
            };

            _dbContext.Add(newFavorite);
            user.ReadList.Add(newFavorite);
            await _dbContext.SaveChangesAsync();

            var resultDto = _mapper.Map<FavoriteItemDto>(newFavorite);
            response.IsSuccess = true;
            response.StatusCode = HttpStatusCode.Created;
            response.Result = resultDto;
            return response;
        }
        public async Task<APIResponse<FavoriteItemDto>> RemoveFromFavoritesAsync(string userId, int bookId)
        {
            var response = new APIResponse<FavoriteItemDto>
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest
            };

            var favorite = await _dbContext.FavoriteItems
                .FirstOrDefaultAsync(f => f.UserId == userId && f.BookId == bookId);

            if (favorite == null)
            {
                response.ErrorMessages.Add("Favorite item not found.");
                response.StatusCode = HttpStatusCode.NotFound;
                return response;
            }

            _dbContext.FavoriteItems.Remove(favorite);
            await _dbContext.SaveChangesAsync();

            response.IsSuccess = true;
            response.StatusCode = HttpStatusCode.OK;
            response.Result = _mapper.Map<FavoriteItemDto>(favorite);
            return response;
        }


    }
}

