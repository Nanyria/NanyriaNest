using Microsoft.EntityFrameworkCore;
using FinalProjectLibrary.Data;
using FinalProjectLibrary.Models.Books;
using FinalProjectLibrary.Helpers.Enums;

namespace FinalProjectLibrary.Repositories
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
                .Include(b => b.StatusHistory) // to access current status
                .ToListAsync();
        }

        public async Task<Book> GetByIdAsync(int id)
        {
            return await _db.Books
                .Include(b => b.StatusHistory)
                .FirstOrDefaultAsync(b => b.BookID == id);
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
