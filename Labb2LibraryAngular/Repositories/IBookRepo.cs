using FinalProjectLibrary.Helpers.Enums;
using FinalProjectLibrary.Models.Books;
using System.Net;

namespace FinalProjectLibrary.Repositories
{
    public interface IBookRepo
    {
        Task<IEnumerable<Book>> GetAllAsync();
        Task<Book> GetByIdAsync(int bookId);
        Task<IEnumerable<Book>> GetByTitleAsync(string title);
        Task<IEnumerable<Book>> GetByAuthorAsync(string author);
        Task<IEnumerable<Book>> GetByGenreAsync(GenreEnums genre);
        Task CreateBookAsync(Book book);
        Task UpdateAsync(Book book);
        Task UpdateStatusAsync(int id, Book book);
        Task DeleteAsync(Book book);
        Task SaveAsync();
    }
}
