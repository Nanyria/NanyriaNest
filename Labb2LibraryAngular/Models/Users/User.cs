using FinalProjectLibrary.Models.Books;
using FinalProjectLibrary.Models.History;
using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace FinalProjectLibrary.Models.Users
{
    public class User : IdentityUser
    {

        [Required]
        [MaxLength(100)]

        public required string FirstName { get; set; }
        [Required]
        [MaxLength(100)]
        public required string LastName { get; set; }

        public List<FavoriteItem> ReadingList { get; set; } = new List<FavoriteItem>();
        public List<ReviewItem> Reviews { get; set; } = new List<ReviewItem>();
        public List<CheckedOutItem> CheckedOutBooks { get; set; } = new List<CheckedOutItem>();
        public List<ReservationItem> ReservedBooks { get; set; } = new List<ReservationItem>();
        public List<StatusHistoryItem> UserHistory { get; set; } = new List<StatusHistoryItem>();
        public List<NotificationItem> Notifications { get; set; } = new();
    }
}
