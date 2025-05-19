using FinalProjectLibrary.Models.Books;
using FinalProjectLibrary.Models.Books.BookDTOs;
using FinalProjectLibrary.Models.Users;
using System.ComponentModel.DataAnnotations;

namespace FinalProjectLibrary.Models
{
    public class ReviewItemDto
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int BookId { get; set; }
        public BookDto Book { get; set; }
        public string? ReviewHeader { get; set; }
        public string? ReviewText { get; set; }
        public RatingItem? RatingItem { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
