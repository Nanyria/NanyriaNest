using AutoMapper;
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
using System.Net;
using static FinalProjectLibrary.Models.Books.BookDTOs.BookDto;


namespace FinalProjectLibrary.Services
{
    public interface IBookService
    {
        Task<APIResponse<List<Book>>> GetAllBooksAsync();
        Task<APIResponse<Book>> GetBookByIdAsync(int id);
        Task<APIResponse<List<Book>>> GetBooksByTitleAsync(string title);
        Task<APIResponse<List<Book>>> GetBooksByAuthorAsync(string author);
        Task<APIResponse<Book>> AddBookAsync(SlimBookDto book);
        Task<APIResponse<Book>> DeleteBookAsync(int id);
        Task<APIResponse<Book>> UpdateBookInfoAsync(int id, BookDto bookDto);
        Task<APIResponse<Book>> UpdateBookStatusAsync(Book book, string userId, BookStatusEnum bookStatus, string? n);
        Task<APIResponse<List<StatusHistoryItem>>> GetBookHistoryAsync(int bookId);
        Task<APIResponse<List<ReservationItem>>> GetBookReservationsAsync(int bookId);
        Task<APIResponse<List<Book>>> GetBooksByGenreAsync(GenreEnums genre, string sortBy = "Title", bool ascending = true);
        Task<APIResponse<List<BookReviewDto>>> GetBookReviewsAsync (int bookId);
        Task<APIResponse<DateTime>> SetAvailabilityDatesForReservations(Book book);
    }
    public class BookService : IBookService
    {

        private readonly IBookRepo _bookRepo;
        private readonly IMapper _mapper;
        private readonly IUserRepo _userRepo;
        private readonly AppDbContext _dbContext;


        public BookService(IBookRepo bookRepo, IMapper mapper, IUserRepo userRepo, AppDbContext dbContext)
        {
            _bookRepo = bookRepo;
            _mapper = mapper;
            _userRepo = userRepo;
            _dbContext = dbContext;
        }

        public async Task<APIResponse<List<Book>>> GetAllBooksAsync()
        {
            var response = new APIResponse<List<Book>>();

            try
            {
                var books = await _bookRepo.GetAllAsync();


                response.Result = books.ToList();
                response.IsSuccess = true;
                response.StatusCode = HttpStatusCode.OK;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ErrorMessages.Add(ex.Message);
                response.StatusCode = HttpStatusCode.InternalServerError;
            }

            return response;
        }

        public async Task<APIResponse<Book>> GetBookByIdAsync(int id)
        {
            var response = new APIResponse<Book>();

            try
            {
                var book = await _bookRepo.GetByIdAsync(id);
                if (book != null)
                {
                    response.Result = book;
                    response.IsSuccess = true;
                    response.StatusCode = HttpStatusCode.OK;
                }
                else
                {
                    response.IsSuccess = false;
                    response.ErrorMessages.Add("Book not found.");
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

        public async Task<APIResponse<List<Book>>> GetBooksByTitleAsync(string title)
        {
            var response = new APIResponse<List<Book>>();

            try
            {
                var books = await _bookRepo.GetByTitleAsync(title);
                if (books.Any())
                {

                    response.Result = books.ToList();
                    response.IsSuccess = true;
                    response.StatusCode = HttpStatusCode.OK;
                }
                else
                {
                    response.IsSuccess = false;
                    response.ErrorMessages.Add("No books found with the provided title.");
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

        public async Task<APIResponse<List<Book>>> GetBooksByAuthorAsync(string author)
        {
            var response = new APIResponse<List<Book>>();

            try
            {
                var books = await _bookRepo.GetByAuthorAsync(author);
                if (books.Any())
                {

                    response.Result = books.ToList();
                    response.IsSuccess = true;
                    response.StatusCode = HttpStatusCode.OK;
                }
                else
                {
                    response.IsSuccess = false;
                    response.ErrorMessages.Add("No books found with the provided author.");
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

        public async Task<APIResponse<Book>> AddBookAsync(SlimBookDto bookDto)
        {
            var response = new APIResponse<Book>
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest
            };

            if (string.IsNullOrEmpty(bookDto.Title))
            {
                response.ErrorMessages.Add("Title must not be empty.");
                return response;
            }

            try
            {
                var book = new Book
                {
                    Title = bookDto.Title,
                    Author = bookDto.Author,
                    Genre = bookDto.Genre,
                    BookDescription = bookDto.BookDescription,
                    PublicationYear = bookDto.PublicationYear,
                    BookType = bookDto.BookType,
                    CoverImagePath = bookDto.CoverImagePath,
                    BookStatus = BookStatusEnum.Available,
                    AvailabilityDate = DateTime.UtcNow
                    
    };

                await _bookRepo.CreateBookAsync(book);
                await _bookRepo.SaveAsync();

                response.Result = book;
                response.IsSuccess = true;
                response.StatusCode = HttpStatusCode.Created;
            }
            catch (Exception ex)
            {
                response.ErrorMessages.Add(ex.Message);
                response.StatusCode = HttpStatusCode.InternalServerError;
            }

            return response;
        }

        public async Task<APIResponse<Book>> DeleteBookAsync(int id)
        {
            var response = new APIResponse<Book>();

            try
            {
                var bookToDelete = await _bookRepo.GetByIdAsync(id);
                if (bookToDelete != null)
                {
                    await _bookRepo.DeleteAsync(bookToDelete);
                    await _bookRepo.SaveAsync();

                    response.Result = bookToDelete;
                    response.IsSuccess = true;
                    response.StatusCode = HttpStatusCode.OK;
                }
                else
                {
                    response.IsSuccess = false;
                    response.ErrorMessages.Add("Book not found.");
                    response.StatusCode = HttpStatusCode.NotFound;
                }
            }
            catch (Exception ex)
            {
                response.ErrorMessages.Add(ex.Message);
                response.StatusCode = HttpStatusCode.InternalServerError;
            }

            return response;
        }

        public async Task<APIResponse<Book>> UpdateBookInfoAsync(int id, BookDto updatedBook)
        {
            var response = new APIResponse<Book>
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest
            };

            try
            {
                var existingBook = await _bookRepo.GetByIdAsync(id);
                if (existingBook != null)
                {
                    existingBook.Title = updatedBook.Title ?? existingBook.Title;
                    existingBook.Author = updatedBook.Author ?? existingBook.Author;
                    existingBook.Genre = updatedBook.Genre != default ? updatedBook.Genre : existingBook.Genre;
                    existingBook.PublicationYear = updatedBook.PublicationYear != default ? updatedBook.PublicationYear : existingBook.PublicationYear;
                    existingBook.BookDescription = updatedBook.BookDescription ?? existingBook.BookDescription;
                    existingBook.BookType = updatedBook.BookType != default ? updatedBook.BookType : existingBook.BookType;
                    existingBook.CoverImagePath = updatedBook.CoverImagePath ?? existingBook.CoverImagePath;
                    await _bookRepo.SaveAsync();

                    response.Result = existingBook;
                    response.IsSuccess = true;
                    response.StatusCode = HttpStatusCode.OK;
                }
                else
                {
                    response.ErrorMessages.Add("Book not found.");
                    response.StatusCode = HttpStatusCode.NotFound;
                }
            }
            catch (Exception ex)
            {
                response.ErrorMessages.Add(ex.Message);
                response.StatusCode = HttpStatusCode.InternalServerError;
            }

            return response;
        }

        public async Task<APIResponse<Book>> UpdateBookStatusAsync(Book book, string? userId, BookStatusEnum bookStatus, string? notes)
        {
            var response = new APIResponse<Book>
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest
            };

            User? user = null;
            if (!string.IsNullOrEmpty(userId))
                user = await _userRepo.GetByIdAsync<User>(userId);

            if (book == null)
            {
                response.ErrorMessages.Add("Book not found.");
                response.StatusCode = HttpStatusCode.NotFound;
                return response;
            }

            var newBookStatus = GetBookStatus(book, bookStatus);

            // Only add status history if user is present
            if (user != null)
                AddStatusHistoryItem(user, book, bookStatus, notes);

            book.BookStatus = newBookStatus.BookStatus;
            book.CheckedOutBy = newBookStatus.CheckedOutBy ?? book.CheckedOutBy;
            book.Reservations = newBookStatus.Reservations ?? book.Reservations;

            if (user != null)
                await _userRepo.UpdateAsync(user);

            await _bookRepo.UpdateAsync(book);
            await _bookRepo.SaveAsync();

            response.Result = newBookStatus;
            response.IsSuccess = true;
            response.StatusCode = HttpStatusCode.OK;
            return response;
        }
        public Book GetBookStatus(Book book, BookStatusEnum bookStatus)
        {
            // If the book was checked out and the user is now removed
            if (book.CheckedOutBy == null && (bookStatus == BookStatusEnum.CheckedOut || bookStatus == BookStatusEnum.Returned))
            {
                // If there are reservations, set to Reserved, else Available
                book.BookStatus = (book.Reservations != null && book.Reservations.Any())
                    ? BookStatusEnum.Reserved
                    : BookStatusEnum.Available;
            }
            else if (bookStatus == BookStatusEnum.Returned)
            {
                // Set to Reserved if there are reservations, otherwise Available
                book.BookStatus = (book.Reservations != null && book.Reservations.Any())
                    ? BookStatusEnum.Reserved
                    : BookStatusEnum.Available;
            }
            else if (book.BookStatus != bookStatus)
            {
                // Determine status based on CheckedOutBy and Reservations
                book.BookStatus = book.CheckedOutBy != null
                    ? BookStatusEnum.CheckedOut
                    : (book.Reservations != null && book.Reservations.Any())
                        ? BookStatusEnum.Reserved
                        : BookStatusEnum.Available;
            }

            return book;
        }
        public async Task<APIResponse<DateTime>> SetAvailabilityDatesForReservations(Book book)
        {
            var response = new APIResponse<DateTime>
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest
            };
            try
            {
                DateTime baseDate;
                if (book.CheckedOutBy != null)
                {
                    // Book is checked out, start from return date
                    baseDate = book.CheckedOutBy.ReturnDate;
                }
                else
                {
                    // Book is available, start from today
                    baseDate = DateTime.UtcNow;
                }

                if (book.Reservations == null || book.Reservations.Count == 0)
                {
                    response.Result = baseDate;
                    response.IsSuccess = true;
                    response.StatusCode = HttpStatusCode.OK;
                }
                else
                {   // Sort reservations by ReservationDate (FIFO)
                    var sortedReservations = book.Reservations
                        .OrderBy(r => r.ReservationDate)
                        .ToList();

                    for (int i = 0; i < sortedReservations.Count; i++)
                    {
                        sortedReservations[i].AvailabilityDate = baseDate.AddMonths(i);
                    }
                    book.AvailabilityDate = sortedReservations.Count > 0
                    ? sortedReservations.Last().AvailabilityDate ?? baseDate
                    : baseDate;

                    response.Result = book.AvailabilityDate;
                    response.StatusCode = HttpStatusCode.OK;


                }
            }
            catch (Exception ex)
            {
                response.ErrorMessages.Add(ex.Message);
                response.StatusCode = HttpStatusCode.InternalServerError;
            }
            return response;
        }
        public void AddStatusHistoryItem(User user, Book book, BookStatusEnum bookStatus, string? notes)
        {
            var statusHistoryItem = new StatusHistoryItem
            {
                UserId = user.Id,
                BookId = book.BookId,
                BookStatus = bookStatus,
                Timestamp = DateTime.UtcNow,
                Notes = notes
            };

            _dbContext.StatusHistoryItems.Add(statusHistoryItem);
            user.UserHistory.Add(statusHistoryItem);
            book.StatusHistory.Add(statusHistoryItem);
            
        }

        public BookStatusEnum GetCurrentStatus(Book book)
        {
            return book.StatusHistory
                .OrderByDescending(sh => sh.Timestamp)
                .FirstOrDefault()?.BookStatus ?? BookStatusEnum.Available;
        }

        public async Task<APIResponse<List<StatusHistoryItem>>> GetBookHistoryAsync(int bookId)
        {
            var response = new APIResponse<List<StatusHistoryItem>>
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest
            };
            var book = await _bookRepo.GetByIdAsync(bookId);
            if (book != null)
            {
                response.IsSuccess = true;
                response.StatusCode = HttpStatusCode.OK;
                response.Result = book.StatusHistory
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
        public async Task<APIResponse<List<ReservationItem>>> GetBookReservationsAsync(int bookId)
        {
            var response = new APIResponse<List<ReservationItem>>
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest
            };
            var book = await _bookRepo.GetByIdAsync(bookId);
            if (book != null)
            {
                response.IsSuccess = true;
                response.StatusCode = HttpStatusCode.OK;
                response.Result = book.Reservations
                    .OrderByDescending(r => r.ReservationDate)
                    .ToList();
            }
            else
            {
                response.ErrorMessages.Add("User not found.");
                response.StatusCode = HttpStatusCode.NotFound;
            }
            return response;
        }

        public async Task<APIResponse<List<Book>>> GetBooksByGenreAsync(
            GenreEnums genre,
            string sortBy = "Title",
            bool ascending = true)
        {
            var response = new APIResponse<List<Book>>();
            try
            {
                var books = await _bookRepo.GetByGenreAsync(genre);

                // Sorting logic
                IEnumerable<Book> sortedBooks = sortBy.ToLower() switch
                {
                    "title" => ascending ? books.OrderBy(b => b.Title) : books.OrderByDescending(b => b.Title),
                    "author" => ascending ? books.OrderBy(b => b.Author) : books.OrderByDescending(b => b.Author),
                    "publishedyear" => ascending ? books.OrderBy(b => b.PublicationYear) : books.OrderByDescending(b => b.PublicationYear),
                    "booktype" => ascending ? books.OrderBy(b => b.BookType) : books.OrderByDescending(b => b.BookType),
                    "added" => ascending
                        ? books.OrderBy(b => b.StatusHistory.Min(sh => sh.Timestamp))
                        : books.OrderByDescending(b => b.StatusHistory.Min(sh => sh.Timestamp)),
                    _ => ascending ? books.OrderBy(b => b.Title) : books.OrderByDescending(b => b.Title)
                };

                if (sortedBooks.Any())
                {
                    response.Result = sortedBooks.ToList();
                    response.IsSuccess = true;
                    response.StatusCode = HttpStatusCode.OK;
                }
                else
                {
                    response.IsSuccess = false;
                    response.ErrorMessages.Add("No books found with the provided genre.");
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

        public async Task<APIResponse<List<BookReviewDto>>> GetBookReviewsAsync(int bookId)
        {
            var response = new APIResponse<List<BookReviewDto>>
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest
            };

            var book = await _bookRepo.GetByIdAsync(bookId);
            if (book != null)
            {
                // Use AutoMapper to map ReviewItem to BookReviewDto
                response.Result = _mapper.Map<List<BookReviewDto>>(book.Reviews.OrderByDescending(r => r.CreatedAt).ToList());
                response.IsSuccess = true;
                response.StatusCode = HttpStatusCode.OK;
            }
            else
            {
                response.ErrorMessages.Add("Book not found.");
                response.StatusCode = HttpStatusCode.NotFound;
            }
            return response;
        }
    }
}
