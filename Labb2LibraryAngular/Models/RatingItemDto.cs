using FinalProjectLibrary.Models.Books;
using FinalProjectLibrary.Models.Users;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace FinalProjectLibrary.Models
{
    public class RatingItemDto
    {
        public int Id { get; set; }
        public int ReviewItemId { get; set; }
        public int Rating { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}

