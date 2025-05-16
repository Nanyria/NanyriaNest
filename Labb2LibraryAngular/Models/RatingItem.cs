using FinalProjectLibrary.Models.Books;
using FinalProjectLibrary.Models.Users;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace FinalProjectLibrary.Models
{
    public class RatingItem
    {
        public int Id { get; set; }

        [ForeignKey("ReviewItem")]
        public int ReviewItemId { get; set; }

        [JsonIgnore]
        public ReviewItem ReviewItem { get; set; }

        public int Rating { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

