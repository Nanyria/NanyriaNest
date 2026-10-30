using NyriaNest.Api.Helpers.Enums;
using NyriaNest.Api.Models.Books;
using NyriaNest.Api.Models.Books.BookDTOs;

namespace NyriaNest.Api.Repositories
{
    public interface IBookRepo
    {
        Task<IEnumerable<Book>> GetAllAsync();
        Task<Book?> GetByIdAsync(int bookId);
        Task<IEnumerable<Book>> GetByTitleAsync(string title);
        Task<IEnumerable<Book>> GetByAuthorAsync(string author);
        Task<IEnumerable<Book>> GetByGenreAsync(GenreEnums genre);
        Task<List<LibraryBookDto>> GetLibraryListAsync(string? userId);
        Task<PagedResult<AdminBookDto>> GetAdminCatalogueAsync(AdminCatalogueQuery q);
        Task CreateBookAsync(Book book);
        Task UpdateAsync(Book book);
        Task DeleteAsync(Book book);
        Task SaveAsync();
    }
}
