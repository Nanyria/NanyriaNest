using NyriaNest.Api.Models.Books;
using NyriaNest.Api.Models.Users;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace NyriaNest.Api.Models
{
    public class FavoriteItem
    {
        public int Id { get; set; }
        [Required]
        [ForeignKey("User")]
        public string UserId { get; set; }
        [JsonIgnore]
        public User User { get; set; }

        [Required]
        [ForeignKey("Book")]
        public int BookId { get; set; }
        [JsonIgnore]
        public Book Book { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
