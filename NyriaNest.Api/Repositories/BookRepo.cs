using Microsoft.EntityFrameworkCore;
using NyriaNest.Api.Data;
using NyriaNest.Api.Helpers.Enums;
using NyriaNest.Api.Models.Books;
using NyriaNest.Api.Models.Books.BookDTOs;
using System.Net;

namespace NyriaNest.Api.Repositories
{
    public class BookRepo : IBookRepo
    {

        private readonly AppDbContext _db;
        public BookRepo(AppDbContext db)
        {
            _db = db;
        }

        public async Task CreateBookAsync(Book book)
        {
            await _db.Books.AddAsync(book);
        }

        public async Task DeleteAsync(Book book)
        {
            _db.Books.Remove(book);
        }


        public async Task<IEnumerable<Book>> GetAllAsync()
        {
            return await _db.Books
                .Include(b => b.CheckedOutBy)
                .Include(b => b.Reviews)// to access current status
                .ToListAsync();
        }

        public async Task<Book> GetByIdAsync(int id)
        {
            return await _db.Books
                   .Include(b => b.Reviews)
                       .ThenInclude(r => r.User)
                   .Include(b => b.Reviews)
                       .ThenInclude(r => r.RatingItem)
                   .Include(b => b.CheckedOutBy)
                   .FirstOrDefaultAsync(b => b.BookId == id);
        }

        public async Task<IEnumerable<Book>> GetByTitleAsync(string title)
        {
            return await _db.Books
                .Include(b => b.StatusHistory)
                .Where(b => b.Title.ToLower().Contains(title.ToLower()))
                .ToListAsync();
        }

        public async Task<IEnumerable<Book>> GetByAuthorAsync(string author)
        {
            return await _db.Books
                .Include(b => b.StatusHistory)
                .Where(b => b.Author.ToLower().Contains(author.ToLower()))
                .ToListAsync();
        }
        public async Task<List<LibraryBookDto>> GetLibraryListAsync(string? userId)
        {
            return await _db.Books
                .AsNoTracking()
                .OrderBy(b => b.Title)
                .Select(b => new LibraryBookDto
                {
                    BookId = b.BookId,
                    Title = b.Title,
                    Author = b.Author,
                    Genre = b.Genre,
                    Language = b.Language,
                    PublicationYear = b.PublicationYear,
                    BookDescription = b.BookDescription,
                    CoverImagePath = b.CoverImagePath,
                    BookStatus = b.BookStatus,
                    BookType = b.BookType,
                    AvailabilityDate = b.AvailabilityDate,
                    DateAdded = b.DateAdded,

                    ReviewCount = b.Reviews.Count,
                    AverageRating = b.Reviews
                        .Where(r => r.RatingItem != null)
                        .Average(r => (double?)r.RatingItem!.Rating),
                    ReservationCount = b.Reservations.Count,

                    IsCheckedOutByMe = userId != null && b.CheckedOutBy != null && b.CheckedOutBy.UserId == userId,
                    IsReservedByMe = userId != null && b.Reservations.Any(r => r.UserId == userId),
                    MyReservationAvailableDate = b.Reservations
                        .Where(r => r.UserId == userId)
                        .Select(r => r.AvailabilityDate)
                        .FirstOrDefault()
                })
                .ToListAsync();
        }
        public async Task SaveAsync()
        {
            await _db.SaveChangesAsync(); 
        }

        public async Task UpdateAsync(Book book)
        {
            _db.Books.Update(book);
        }

        public async Task UpdateStatusAsync(int id, Book book)
        {

            _db.Books.Update(book);
        }
        public async Task<IEnumerable<Book>> GetByGenreAsync(GenreEnums genre)
        {
            return await _db.Books
                .Include(b => b.StatusHistory)
                .Where(b => b.Genre == genre)
                .ToListAsync();
        }
    }
}
