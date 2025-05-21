using FinalProjectLibrary.Helpers.Enums;
using FinalProjectLibrary.Models.History;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
namespace FinalProjectLibrary.Models.Books
{
    public class Book
    {
        [Key]
        public int BookId { get; set; }
        [Required]
        [MaxLength(100)]
        public required string Title { get; set; }

        [Required]
        [MaxLength(75)]
        public required string Author { get; set; }

        public GenreEnums Genre { get; set; }
        public int PublicationYear { get; set; }
        public string? BookDescription { get; set; }
        public string? CoverImagePath { get; set; }
        public required BookStatusEnum BookStatus { get; set; }
        public BookTypeEnums BookType { get; set; }

        // Lists
        public List<ReviewItem> Reviews { get; set; } = new();
        public List<StatusHistoryItem> StatusHistory { get; set; } = new();
        public List<ReservationItem> Reservations { get; set; } = new();
        public CheckedOutItem? CheckedOutBy { get; set; }



    }
}
