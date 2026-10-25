using NyriaNest.Api.Models.Books;
using NyriaNest.Api.Models.Users;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace NyriaNest.Api.Models
{
    public class RatingItemDto
    {
        public int Id { get; set; }
        public int ReviewItemId { get; set; }

        [Range(0, 10, ErrorMessage = "Rating must be between 0 and 10.")]
        public int Rating { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

