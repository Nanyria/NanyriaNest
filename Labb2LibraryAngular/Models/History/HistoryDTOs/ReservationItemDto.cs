using FinalProjectLibrary.Models.Books.BookDTOs;
using FinalProjectLibrary.Models.Users.UserDTOs;

namespace FinalProjectLibrary.Models
{
    public class ReservationItemDto
    {

        public int Id { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        public int BookID { get; set; }
        public string BookTitle { get; set; }
        public DateTime ReservationDate { get; set; }
        public DateTime? AvailabilityDate { get; set; }
        public DateTime? BookIsAvaliableEmailSent { get; set; }
    }
}
