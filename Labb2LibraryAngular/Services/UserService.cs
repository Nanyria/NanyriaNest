using AutoMapper;
using Azure;
using FinalProjectLibrary.Data;
using FinalProjectLibrary.Helpers.Enums;
using FinalProjectLibrary.Models;
using FinalProjectLibrary.Models.Books;
using FinalProjectLibrary.Models.Books.BookDTOs;
using FinalProjectLibrary.Models.History;
using FinalProjectLibrary.Models.History.HistoryDTOs;
using FinalProjectLibrary.Models.Users;
using FinalProjectLibrary.Models.Users.UserDTOs;
using FinalProjectLibrary.Repositories;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Net;

namespace FinalProjectLibrary.Services
{
    public interface IUserService
    {
        Task<APIResponse<CreateUserDto>> AddUserAsync(CreateUserDto createUserDTO);
        Task<APIResponse<User>> DeleteUserAsync(string userId);
        Task<APIResponse<UpdateUserAsAdminDto>> UpdateUserAsAdminAsync(string userId, UpdateUserAsAdminDto userToUpdate);
        Task<APIResponse<UpdateUserDto>> UpdateUserAsync(string userId, UpdateUserDto userToUpdate);
        Task<APIResponse<UserDto>> GetUserByIdAsync(string userId);
        Task<APIResponse<List<User>>> GetAllUsersAsync();
        //Task<APIResponse<User>> ReserveBookAsync(string userId, int bookId);
        //Task<APIResponse<User>> CancelReservationAsync(string userId, int bookId);
        //Task<APIResponse<UserDto>> CheckOutBookAsync(string userId, int bookId);
        //Task<APIResponse<User>> ReturnBookAsync(string userId, int bookId);
        Task<APIResponse<CreateAdminUserDto>> CreateAdminUserAsync(CreateAdminUserDto createAdminUserDto);
        //Task<APIResponse<List<ReservationItemDto>>> GetReservedBooksAsync(string userId);
        //Task<APIResponse<List<CheckedOutItemDto>>> GetCheckedOutBooksAsync(string userId);
        Task<APIResponse<List<StatusHistoryItem>>> GetUserHistoryAsync(string userId);
    }

    public class UserService : IUserService
    {
        private readonly IUserRepo _userRepo;
        private readonly IBookRepo _bookRepo;
        private readonly IMapper _mapper;
        private readonly IBookService _bookService;
        private readonly AppDbContext _dbContext;
        private readonly UserManager<User> _userManager;

        public UserService(IUserRepo userRepo, IBookRepo bookRepo, IMapper mapper, IBookService bookService, AppDbContext dbContext, UserManager<User> userManager)
        {
            _userRepo = userRepo;
            _bookRepo = bookRepo;
            _mapper = mapper;
            _bookService = bookService;
            _dbContext = dbContext;
            _userManager = userManager;
        }

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

            var createdUserDto = _mapper.Map<CreateUserDto>(user);
            response.IsSuccess = true;
            response.StatusCode = HttpStatusCode.Created;
            response.Result = createdUserDto;
            return response;
        }
        public async Task<APIResponse<CreateAdminUserDto>> CreateAdminUserAsync(CreateAdminUserDto createAdminUserDto)
        {
            var response = new APIResponse<CreateAdminUserDto>
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest
            };
            if (!AdminRoles.AllRoles.Contains(createAdminUserDto.AdminRole))
            {
                response.ErrorMessages.Add("Invalid AdminRole.");
                return response;

            }
            CheckIfExists(createAdminUserDto.Email, createAdminUserDto.UserName);
            var user = _mapper.Map<User>(createAdminUserDto);

            // Create user with password
            var result = await _userManager.CreateAsync(user, createAdminUserDto.Password);
            if (!result.Succeeded)
            {
                response.ErrorMessages.AddRange(result.Errors.Select(e => e.Description));
                return response;
            }

            // Assign admin role
            var roleResult = await _userManager.AddToRoleAsync(user, createAdminUserDto.AdminRole);
            if (!roleResult.Succeeded)
            {
                response.ErrorMessages.AddRange(roleResult.Errors.Select(e => e.Description));
                return response;
            }

            response.IsSuccess = true;
            response.StatusCode = HttpStatusCode.Created;
            response.Result = createAdminUserDto;
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
        public async Task<APIResponse<User>> DeleteUserAsync(string userId)
        {
            var response = new APIResponse<User>
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest
            };

            // Find the user using UserManager (by Id)
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user != null)
            {
                var result = await _userManager.DeleteAsync(user);
                if (!result.Succeeded)
                {
                    response.ErrorMessages.AddRange(result.Errors.Select(e => e.Description));
                    response.StatusCode = HttpStatusCode.InternalServerError;
                    return response;
                }

                response.IsSuccess = true;
                response.StatusCode = HttpStatusCode.NoContent;
                response.Result = user;
            }
            else
            {
                response.ErrorMessages.Add("User not found.");
                response.StatusCode = HttpStatusCode.NotFound;
            }
            return response;
        }

        public async Task<APIResponse<UpdateUserAsAdminDto>> UpdateUserAsAdminAsync(string userId, UpdateUserAsAdminDto userToUpdate)
        {
            var response = new APIResponse<UpdateUserAsAdminDto>
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest
            };
            var user = await _userRepo.GetByIdAsync<User>(userId);
            if (user != null)
            {
                // Map UpdateUserAsAdminDto to User
                _mapper.Map(userToUpdate, user);
                // If password is being changed, use UserManager
                if (!string.IsNullOrWhiteSpace(userToUpdate.Password))
                {
                    // Remove old password and set new one
                    var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                    var passwordResult = await _userManager.ResetPasswordAsync(user, token, userToUpdate.Password);
                    if (!passwordResult.Succeeded)
                    {
                        response.ErrorMessages.AddRange(passwordResult.Errors.Select(e => e.Description));
                        return response;
                    }
                }

                var updateResult = await _userManager.UpdateAsync(user);
                if (!updateResult.Succeeded)
                {
                    response.ErrorMessages.AddRange(updateResult.Errors.Select(e => e.Description));
                    return response;
                }

                // Map updated User to UpdateUserAsAdminDto for the response
                var updatedUserDto = _mapper.Map<UpdateUserAsAdminDto>(user);
                response.IsSuccess = true;
                response.StatusCode = HttpStatusCode.OK;
                response.Result = updatedUserDto;
            }
            else
            {
                response.ErrorMessages.Add("User not found.");
                response.StatusCode = HttpStatusCode.NotFound;
            }
            return response;
        }
        public async Task<APIResponse<UpdateUserDto>> UpdateUserAsync(string userId, UpdateUserDto userToUpdate)
        {
            var response = new APIResponse<UpdateUserDto>
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest
            };
            var user = await _userRepo.GetByIdAsync<User>(userId);
            if (user != null)
            {

                // Map UpdateUserDto to User
                _mapper.Map(userToUpdate, user);

                if (!string.IsNullOrWhiteSpace(userToUpdate.Password))
                {
                    var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                    var passwordResult = await _userManager.ResetPasswordAsync(user, token, userToUpdate.Password);
                    if (!passwordResult.Succeeded)
                    {
                        response.ErrorMessages.AddRange(passwordResult.Errors.Select(e => e.Description));
                        return response;
                    }
                }

                var updateResult = await _userManager.UpdateAsync(user);
                if (!updateResult.Succeeded)
                {
                    response.ErrorMessages.AddRange(updateResult.Errors.Select(e => e.Description));
                    return response;
                }

                var updatedUserDto = _mapper.Map<UpdateUserDto>(user);
                response.IsSuccess = true;
                response.StatusCode = HttpStatusCode.OK;
                response.Result = updatedUserDto;
            }
            else
            {
                response.ErrorMessages.Add("User not found.");
                response.StatusCode = HttpStatusCode.NotFound;
            }
            return response;
        }
        public async Task<APIResponse<UserDto>> GetUserByIdAsync(string userId)
        {
            var response = new APIResponse<UserDto>
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest
            };
            var user = await _userRepo.GetByIdAsync<User>(userId);
            if (user != null)
            {
                var userDto = _mapper.Map<UserDto>(user);
                response.IsSuccess = true;
                response.StatusCode = HttpStatusCode.OK;
                response.Result = userDto;
            }
            else
            {
                response.ErrorMessages.Add("User not found.");
                response.StatusCode = HttpStatusCode.NotFound;
            }
            return response;
        }
        public async Task<APIResponse<List<User>>> GetAllUsersAsync()
        {
            var response = new APIResponse<List<User>>
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest
            };
            try
            {
                var users = await _userRepo.GetAllAsync<User>();
                if (users != null)
                {
                    response.Result = users.ToList();
                    response.IsSuccess = true;
                    response.StatusCode = HttpStatusCode.OK;
                }
                else
                {
                    response.ErrorMessages.Add("No users found.");
                    response.StatusCode = HttpStatusCode.NotFound;
                }
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessages.Add(ex.Message);
                response.StatusCode = HttpStatusCode.InternalServerError;
            }

            return response;
        }
        //public async Task<APIResponse<User>> ReserveBookAsync(string userId, int bookId)
        //{
        //    var response = new APIResponse<User>
        //    {
        //        IsSuccess = false,
        //        StatusCode = HttpStatusCode.BadRequest
        //    };

        //    var user = await _userRepo.GetByIdAsync<User>(userId);
        //    var book = await _bookRepo.GetByIdAsync(bookId);

        //    if (user == null || book == null)
        //    {
        //        response.ErrorMessages.Add("User or Book not found.");
        //        response.StatusCode = HttpStatusCode.NotFound;
        //        return response;
        //    }


        //    if (user != null && book != null)
        //    {
        //        if (user.ReservedBooks.Any(r => r.BookId == book.BookId))
        //        {
        //            response.ErrorMessages.Add("Book already reserved by user.");
        //            response.StatusCode = HttpStatusCode.Conflict;
        //            return response;
        //        }
        //        else if (user.CheckedOutBooks.Any(b => b.BookId == book.BookId))
        //        {
        //            response.ErrorMessages.Add("Book already checked out by user.");
        //            response.StatusCode = HttpStatusCode.Conflict;
        //            return response;
        //        }
        //        ;

        //        AddReservation(user, book);

        //        await _bookService.UpdateBookStatusAsync(book, user.Id, BookStatusEnum.Reserved, $"Book reserved by {user.UserName}"); // Update the book status to Reserved

        //        await _dbContext.SaveChangesAsync();

        //        response.IsSuccess = true;
        //        response.StatusCode = HttpStatusCode.OK;
        //        response.Result = user;
        //    }
        //    else
        //    {
        //        response.ErrorMessages.Add("User or Book not found.");
        //        response.StatusCode = HttpStatusCode.NotFound;
        //    }

        //    return response;
        //}
        //private void AddReservation(User user, Book book)
        //{
        //    var reservation = new ReservationItem
        //    {
        //        BookId = book.BookId,
        //        Book = book,
        //        BookIsAvaliableEmailSent = null,
        //        AvailabilityDate = null,
        //        UserId = user.Id,
        //        User = user,
        //        ReservationDate = DateTime.UtcNow
        //    };
        //    user.ReservedBooks.Add(reservation);
        //    book.Reservations.Add(reservation);
        //    _dbContext.ReservationItems.Add(reservation);
        //}

        //public bool RemoveReservation(User user, Book book)
        //{
        //    // Find the reservation item for the given book
        //    var reservationItem = user.ReservedBooks.FirstOrDefault(r => r.BookId == book.BookId);
        //    if (reservationItem != null)
        //    {
        //        // Remove the reservation from both the user and the book
        //        user.ReservedBooks.Remove(reservationItem);
        //        book.Reservations.Remove(reservationItem);

        //        return true;
        //    }

        //    return false;
        //}

        //public async Task<APIResponse<User>> CancelReservationAsync(string userId, int bookId)
        //{
        //    var response = new APIResponse<User>
        //    {
        //        IsSuccess = false,
        //        StatusCode = HttpStatusCode.BadRequest
        //    };

        //    var bookResponse = await _bookService.GetBookByIdAsync(bookId);
        //    var user = await _userRepo.GetByIdAsync<User>(userId);
        //    var book = bookResponse.Result;



        //    if (user != null && book != null)
        //    {
        //        // Use the refactored RemoveReservation method
        //        if (RemoveReservation(user, book))
        //        {
        //            await _bookService.UpdateBookStatusAsync(book, user.Id, BookStatusEnum.Available, $"Reservation cancelled by {user.UserName}");

        //            await _userRepo.SaveAsync();
        //            await _bookRepo.SaveAsync();


        //            response.IsSuccess = true;
        //            response.StatusCode = HttpStatusCode.OK;
        //            response.Result = user;
        //        }
        //        else
        //        {
        //            response.ErrorMessages.Add("Book not reserved by user.");
        //            response.StatusCode = HttpStatusCode.Conflict;
        //        }
        //    }
        //    else
        //    {
        //        response.ErrorMessages.Add("User or Book not found.");
        //        response.StatusCode = HttpStatusCode.NotFound;
        //    }

        //    return response;
        //}

        //public async Task<APIResponse<UserDto>> CheckOutBookAsync(string userId, int bookId)
        //{
        //    var response = new APIResponse<UserDto>
        //    {
        //        IsSuccess = false,
        //        StatusCode = HttpStatusCode.BadRequest
        //    };


        //    var bookResponse = await _bookService.GetBookByIdAsync(bookId);
        //    var user = await _userRepo.GetByIdAsync<User>(userId);
        //    var book = bookResponse.Result;


        //    if (user != null && book != null)
        //    {
        //        // Check if the book is reserved by the user
        //        if (RemoveReservation(user, book) || book.BookStatus == BookStatusEnum.Available)
        //        {
        //            SetCheckedOutBookAsync(user, book);
        //            await _bookService.UpdateBookStatusAsync(book, user.Id, BookStatusEnum.CheckedOut, $"Checked out by {user.UserName}");
        //        }

        //        else
        //        {
        //            response.ErrorMessages.Add("Book is not available to check out.");
        //            response.StatusCode = HttpStatusCode.Conflict;
        //            return response;
        //        }

        //        await _userRepo.UpdateAsync(user);
        //        await _userRepo.SaveAsync();

        //        var userDto = _mapper.Map<UserDto>(user);
        //        response.IsSuccess = true;
        //        response.StatusCode = HttpStatusCode.OK;
        //        response.Result = userDto;
        //    }
        //    else
        //    {
        //        response.ErrorMessages.Add("User or Book not found.");
        //        response.StatusCode = HttpStatusCode.NotFound;
        //    }

        //    return response;
        //}
        //public void SetCheckedOutBookAsync(User user, Book book)
        //{
        //    var checkedOutItem = new CheckedOutItem
        //    {
        //        BookId = book.BookId,
        //        UserId = user.Id,
        //        CheckOutDate = DateTime.UtcNow,
        //        ReturnDate = DateTime.UtcNow.AddMonths(1),
        //    };
        //    user.CheckedOutBooks.Add(checkedOutItem);
        //}

        //public async Task<APIResponse<User>> ReturnBookAsync(string userId, int bookId)
        //{
        //    var response = new APIResponse<User>
        //    {
        //        IsSuccess = false,
        //        StatusCode = HttpStatusCode.BadRequest
        //    };

        //    var bookResponse = await _bookService.GetBookByIdAsync(bookId);
        //    var user = await _userRepo.GetByIdAsync<User>(userId);
        //    var book = bookResponse.Result;

        //    if (user != null && book != null)
        //    {
        //        if (user.CheckedOutBooks.Any(c => c.BookId == book.BookId))
        //        {
        //            RemoveFromCheckedOutList(user, book);
        //        }
        //        await _bookService.UpdateBookStatusAsync(book, user.Id, BookStatusEnum.Returned, $"Returned by {user.UserName}");

        //        await _userRepo.SaveAsync();
        //        await _bookRepo.SaveAsync();

        //        response.IsSuccess = true;
        //        response.StatusCode = HttpStatusCode.OK;
        //        response.Result = user;
        //    }
        //    else
        //    {
        //        response.ErrorMessages.Add("User or Book not found.");
        //        response.StatusCode = HttpStatusCode.NotFound;
        //    }

        //    return response;
        //}
        //public bool RemoveFromCheckedOutList(User user, Book book)
        //{
        //    // Find the reservation item for the given book
        //    var checkedOutItem = user.CheckedOutBooks.FirstOrDefault(r => r.BookId == book.BookId);
        //    if (checkedOutItem != null)
        //    {
        //        // Remove the reservation from both the user and the book
        //        user.CheckedOutBooks.Remove(checkedOutItem);
        //        book.CheckedOutBy = null;

        //        return true;
        //    }

        //    return false;
        //}

        //public async Task<APIResponse<List<ReservationItemDto>>> GetReservedBooksAsync(string userId)
        //{
        //    var response = new APIResponse<List<ReservationItemDto>>
        //    {
        //        IsSuccess = false,
        //        StatusCode = HttpStatusCode.BadRequest
        //    };

        //    // Check if user exists
        //    var user = await _userRepo.GetByIdAsync<User>(userId);
        //    if (user == null)
        //    {
        //        response.ErrorMessages.Add("User not found.");
        //        response.StatusCode = HttpStatusCode.NotFound;
        //        return response;
        //    }

        //    // Query ReservationItems directly and include the Book
        //    var reservations = await _dbContext.ReservationItems
        //        .Where(r => r.UserId == userId)
        //        .Include(r => r.Book)
        //        .OrderByDescending(r => r.ReservationDate)
        //        .ToListAsync();

        //    // Map to DTOs
        //    var reservationDtos = _mapper.Map<List<ReservationItemDto>>(reservations);

        //    response.IsSuccess = true;
        //    response.StatusCode = HttpStatusCode.OK;
        //    response.Result = reservationDtos;
        //    return response;
        //}

        //public async Task<APIResponse<List<CheckedOutItemDto>>> GetCheckedOutBooksAsync(string userId)
        //{
        //    var response = new APIResponse<List<CheckedOutItemDto>>
        //    {
        //        IsSuccess = false,
        //        StatusCode = HttpStatusCode.BadRequest
        //    };
        //    var user = await _userRepo.GetByIdAsync<User>(userId);
        //    if (user == null)
        //    {
        //        response.ErrorMessages.Add("User not found.");
        //        response.StatusCode = HttpStatusCode.NotFound;
        //        return response;
        //    }
        //    var checkedOutBooks = await _dbContext.CheckOutItems
        //        .Where(r => r.UserId == userId)
        //        .Include(r => r.Book)
        //        .OrderByDescending(r => r.CheckOutDate)
        //        .ToListAsync();

        //    // Map to DTOs
        //    var checkedOutDtos = _mapper.Map<List<CheckedOutItemDto>>(checkedOutBooks);

        //    response.IsSuccess = true;
        //    response.StatusCode = HttpStatusCode.OK;
        //    response.Result = checkedOutDtos;
        //    return response;
        //}
        
        public async Task<APIResponse<List<StatusHistoryItem>>> GetUserHistoryAsync(string userId)
        {
            var response = new APIResponse<List<StatusHistoryItem>>
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest
            };
            var user = await _userRepo.GetByIdAsync<User>(userId);
            if (user != null)
            {
                response.IsSuccess = true;
                response.StatusCode = HttpStatusCode.OK;
                response.Result = user.UserHistory
                    .OrderByDescending(r => r.Timestamp)
                    .ToList();
            }
            else
            {
                response.ErrorMessages.Add("User not found.");
                response.StatusCode = HttpStatusCode.NotFound;
            }
            return response;
        }


    }
}

    
