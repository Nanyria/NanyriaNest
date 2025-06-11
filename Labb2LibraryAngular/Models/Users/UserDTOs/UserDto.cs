using FinalProjectLibrary.Models.Books;
using FinalProjectLibrary.Models.Books.BookDTOs;
using FinalProjectLibrary.Models.History.HistoryDTOs;
using System.ComponentModel.DataAnnotations;

namespace FinalProjectLibrary.Models.Users.UserDTOs
{
    public class UserDto
    {
		public string UserId { get; set; }
		public required string UserName { get; set; }
		public required string FirstName { get; set; }
		public required string LastName { get; set; }

		public required string Email { get; set; }
		public required string Password { get; set; }
        public string? ProfilePictureUrl { get; set; } // or ProfilePictureName
        [MaxLength(500)]
        public string? Bio { get; set; }
        public required string Role { get; set; }
        public List<FavoriteItemDto> ReadList { get; set; } = new List<FavoriteItemDto>();
        public List<ReviewItemDto> Reviews { get; set; } = new List<ReviewItemDto>();
        public List<CheckedOutItemDto> CheckedOutBooks { get; set; } = new List<CheckedOutItemDto>();
		public List<ReservationItemDto> ReservedBooks { get; set; } = new List<ReservationItemDto>();
		public List<StatusHistoryItemDto> UserHistory { get; set; } = new List<StatusHistoryItemDto>();
        public List<NotificationItemDto> Notifications { get; set; } = new();

    }
}

