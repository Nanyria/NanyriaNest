using AutoMapper;
using NyriaNest.Api.Data;
using NyriaNest.Api.Helpers.Enums;
using NyriaNest.Api.Models;
using NyriaNest.Api.Models.Books;
using NyriaNest.Api.Models.Books.BookDTOs;
using NyriaNest.Api.Models.History;
using NyriaNest.Api.Models.Users;
using NyriaNest.Api.Repositories;
using NyriaNest.Api.Storage;
using System.Net;


namespace NyriaNest.Api.Services
{
    public interface IBookService
    {
        Task<APIResponse<List<Book>>> GetAllBooksAsync();
        Task<APIResponse<Book>> GetBookByIdAsync(int id);
        Task<APIResponse<List<Book>>> GetBooksByTitleAsync(string title);
        Task<APIResponse<List<Book>>> GetBooksByAuthorAsync(string author);
        // Accept optional userId of the actor who adds the book
        Task<APIResponse<Book>> AddBookAsync(SlimBookDto book, string? userId = null);
        Task<APIResponse<Book>> AddEbookAsync(SlimBookDto bookDto, IFormFile file, CancellationToken ct = default);
        Task<APIResponse<Book>> DeleteBookAsync(int id);
        Task<APIResponse<Book>> UpdateBookInfoAsync(int id, SlimBookDto bookDto);
        Task<APIResponse<Book>> UpdateBookStatusAsync(Book book, string userId, BookStatusEnum bookStatus, string? n);
        Task<APIResponse<List<StatusHistoryItem>>> GetBookHistoryAsync(int bookId);
        Task<APIResponse<List<ReservationItem>>> GetBookReservationsAsync(int bookId);
        Task<APIResponse<List<Book>>> GetBooksByGenreAsync(GenreEnums genre, string sortBy = "Title", bool ascending = true);
        Task<APIResponse<List<BookReviewDto>>> GetBookReviewsAsync (int bookId);
        Task<APIResponse<DateTime>> SetAvailabilityDatesForReservations(Book book);
        Task<APIResponse<List<LibraryBookDto>>> GetLibraryAsync(string? userId);
        Task<APIResponse<Book>> SetAdminStatusAsync(int bookId, BookStatusEnum status, string? adminUserId, string? notes);
        Task<APIResponse<Book>> ClearAdminStatusAsync(int bookId, string? adminUserId);
    }
    public class BookService : IBookService
    {
        private readonly IBookRepo _bookRepo;
        private readonly IMapper _mapper;
        private readonly IUserRepo _userRepo;
        private readonly AppDbContext _dbContext;
        private readonly IFileStorage _fileStorage;
        private readonly ILogger<BookService> _logger;
        private readonly IEpubService _epubService;

        public BookService(IBookRepo bookRepo, IMapper mapper, IUserRepo userRepo, AppDbContext dbContext,
            IFileStorage fileStorage, ILogger<BookService> logger, IEpubService epubService)
        {
            _bookRepo = bookRepo;
            _mapper = mapper;
            _userRepo = userRepo;
            _dbContext = dbContext;
            _fileStorage = fileStorage;
            _logger = logger;
            _epubService = epubService;
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
        public async Task<APIResponse<Book>> AddBookAsync(SlimBookDto bookDto, string? userId = null)
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
                    Language = bookDto.Language,
                    BookDescription = bookDto.BookDescription,
                    PublicationYear = bookDto.PublicationYear,
                    BookType = bookDto.BookType,
                    CoverImagePath = bookDto.CoverImagePath,
                    // current live status for the book (what clients should see)
                    BookStatus = BookStatusEnum.Available,
                    AvailabilityDate = DateTime.UtcNow
                };

                // persist book so we have a BookId for history items
                await _bookRepo.CreateBookAsync(book);
                await _bookRepo.SaveAsync();

                // lookup user if provided
                User? user = null;
                if (!string.IsNullOrEmpty(userId))
                {
                    try
                    {
                        user = await _userRepo.GetByIdAsync<User>(userId);
                    }
                    catch
                    {
                        user = null;
                    }
                }

                // record lifecycle: Added -> Available. Keep the book.BookStatus as Available (current).
                var now = DateTime.UtcNow;
                var later = now.AddTicks(1);

                if (user != null)
                {
                    // first: Added (actor)
                    var addedItem = new StatusHistoryItem
                    {
                        UserId = user.Id,
                        BookId = book.BookId,
                        BookStatus = BookStatusEnum.Added,
                        Timestamp = now,
                        Notes = "Added"
                    };
                    // second: Available (current)
                    var availableItem = new StatusHistoryItem
                    {
                        UserId = user.Id,
                        BookId = book.BookId,
                        BookStatus = BookStatusEnum.Available,
                        Timestamp = later,
                        Notes = "Set to Available"
                    };

                    _dbContext.StatusHistoryItems.AddRange(addedItem, availableItem);
                    user.UserHistory.Add(addedItem);
                    user.UserHistory.Add(availableItem);
                    book.StatusHistory.Add(addedItem);
                    book.StatusHistory.Add(availableItem);

                    // persist history
                    await _bookRepo.SaveAsync();
                    await _userRepo.UpdateAsync(user);
                }
                else
                {
                    // no user -> history items with null UserId
                    var addedItem = new StatusHistoryItem
                    {
                        UserId = null,
                        BookId = book.BookId,
                        Book = book,
                        BookStatus = BookStatusEnum.Added,
                        Timestamp = now,
                        Notes = "Added"
                    };
                    var availableItem = new StatusHistoryItem
                    {
                        UserId = null,
                        BookId = book.BookId,
                        Book = book,
                        BookStatus = BookStatusEnum.Available,
                        Timestamp = later,
                        Notes = "Set to Available"
                    };

                    _dbContext.StatusHistoryItems.AddRange(addedItem, availableItem);
                    book.StatusHistory.Add(addedItem);
                    book.StatusHistory.Add(availableItem);

                    await _bookRepo.SaveAsync();
                }

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
        public async Task<APIResponse<Book>> AddEbookAsync(SlimBookDto bookDto, IFormFile file, CancellationToken ct = default)
        {
            var response = new APIResponse<Book>
            {
                IsSuccess = false,
                StatusCode = HttpStatusCode.BadRequest
            };

            // Validate the file before anything is written, so an invalid file never creates a book
            var fileError = await _epubService.ValidateAsync(file, ct);
            if (fileError is not null)
            {
                response.ErrorMessages.Add(fileError);
                return response;
            }

            // This endpoint only creates e-books, whatever the client sent
            bookDto.BookType = BookTypeEnums.EBook;

            // Disposing the transaction without a commit rolls back the book and its history
            await using var transaction = await _dbContext.Database.BeginTransactionAsync(ct);

            var created = await AddBookAsync(bookDto);
            if (!created.IsSuccess || created.Result is null)
                return created;

            var upload = await _epubService.UploadAsync(created.Result.BookId, file, ct);
            if (!upload.IsSuccess)
            {
                response.StatusCode = upload.StatusCode;
                response.ErrorMessages.AddRange(upload.ErrorMessages);
                return response;
            }

            try
            {
                await transaction.CommitAsync(ct);
            }
            catch
            {
                // The book is rolled back, so don't leave its file behind
                await _fileStorage.DeleteAsync(upload.Result!, CancellationToken.None);
                throw;
            }

            // UploadAsync set EpubFileKey on the same tracked Book, so HasEpub is true here
            return created;
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

                    // Delete the EPUB only after the book is gone from the database,
                    // so a failed DB delete never leaves a book pointing at a missing file
                    if (bookToDelete.EpubFileKey is not null)
                    {
                        try
                        {
                            await _fileStorage.DeleteAsync(bookToDelete.EpubFileKey);
                        }
                        catch (Exception ex)
                        {
                            // The book is already deleted; a leftover file is harmless, so log instead of failing
                            _logger.LogWarning(ex, "Could not delete EPUB {Key} for deleted book {BookId}.", bookToDelete.EpubFileKey, id);
                        }
                    }

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
        public async Task<APIResponse<Book>> UpdateBookInfoAsync(int id, SlimBookDto updatedBook)
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
                    existingBook.Language = updatedBook.Language != default ? updatedBook.Language : existingBook.Language;
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
        public Book GetBookStatus(Book book, BookStatusEnum bookStatus)
        {
            // An admin-set status (Lost/Removed) always wins
            if (book.AdminStatus is BookStatusEnum.Lost or BookStatusEnum.Removed)
            {
                book.BookStatus = book.AdminStatus.Value;
                return book;
            }
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
        public async Task<APIResponse<List<LibraryBookDto>>> GetLibraryAsync(string? userId)
        {
            var response = new APIResponse<List<LibraryBookDto>>();
            try
            {
                response.Result = await _bookRepo.GetLibraryListAsync(userId);
                response.IsSuccess = true;
                response.StatusCode = HttpStatusCode.OK;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.StatusCode = HttpStatusCode.InternalServerError;
                response.ErrorMessages.Add(ex.Message);
            }
            return response;
        }

        public async Task<APIResponse<Book>> SetAdminStatusAsync(int bookId, BookStatusEnum status, string? adminUserId, string? notes)
        {
            var response = new APIResponse<Book> { IsSuccess = false, StatusCode = HttpStatusCode.BadRequest };

            if (status is not (BookStatusEnum.Lost or BookStatusEnum.Removed))
            {
                response.ErrorMessages.Add("Admins can only set Lost or Removed.");
                return response;
            }

            var book = await _bookRepo.GetByIdAsync(bookId);
            if (book == null)
            {
                response.StatusCode = HttpStatusCode.NotFound;
                response.ErrorMessages.Add("Book not found.");
                return response;
            }
            if (book.CheckedOutBy != null)
            {
                response.ErrorMessages.Add("This book is checked out. Return it first.");
                return response;
            }

            book.AdminStatus = status;
            book.AdminStatusSetAt = DateTime.UtcNow;
            book.AdminStatusNotes = notes;
            GetBookStatus(book, status);

            await AddHistoryIfAdminAsync(adminUserId, book, status, notes);
            await _bookRepo.UpdateAsync(book);
            await _bookRepo.SaveAsync();

            response.Result = book;
            response.IsSuccess = true;
            response.StatusCode = HttpStatusCode.OK;
            return response;
        }

        public async Task<APIResponse<Book>> ClearAdminStatusAsync(int bookId, string? adminUserId)
        {
            var response = new APIResponse<Book> { IsSuccess = false, StatusCode = HttpStatusCode.NotFound };
            var book = await _bookRepo.GetByIdAsync(bookId);
            if (book == null) { response.ErrorMessages.Add("Book not found."); return response; }

            book.AdminStatus = null;
            book.AdminStatusSetAt = null;
            book.AdminStatusNotes = null;
            // "Returned" makes GetBookStatus recompute: Reserved if there are reservations, else Available
            GetBookStatus(book, BookStatusEnum.Returned);

            await AddHistoryIfAdminAsync(adminUserId, book, book.BookStatus, "Restored by admin");
            await _bookRepo.UpdateAsync(book);
            await _bookRepo.SaveAsync();

            response.Result = book;
            response.IsSuccess = true;
            response.StatusCode = HttpStatusCode.OK;
            return response;
        }

        private async Task AddHistoryIfAdminAsync(string? adminUserId, Book book, BookStatusEnum status, string? notes)
        {
            if (string.IsNullOrEmpty(adminUserId)) return;
            var admin = await _userRepo.GetByIdAsync<User>(adminUserId);
            if (admin != null) AddStatusHistoryItem(admin, book, status, notes);
        }

    }
}
