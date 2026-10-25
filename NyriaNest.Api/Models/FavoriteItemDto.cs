using NyriaNest.Api.Models.Books;
using NyriaNest.Api.Models.Books.BookDTOs;
using NyriaNest.Api.Models.Users;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NyriaNest.Api.Models
{
    public class FavoriteItemDto
    {
        public string UserId { get; set; }
        public int BookId { get; set; }
        public SlimBookDto Book { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
