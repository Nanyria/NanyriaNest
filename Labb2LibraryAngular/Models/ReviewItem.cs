using FinalProjectLibrary.Models.Books;
using FinalProjectLibrary.Models.Users;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace FinalProjectLibrary.Models
{
    public class ReviewItem
    {
        public int Id { get; set; }
        [Required]
        public string UserId { get; set; }
        [JsonIgnore]
        public User User { get; set; }

        [Required]
        public int BookId { get; set; }
        [JsonIgnore]
        public Book Book { get; set; }
        public string? ReviewHeader { get; set; } 
        public string? ReviewText { get; set; } 
        public RatingItem? RatingItem { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
