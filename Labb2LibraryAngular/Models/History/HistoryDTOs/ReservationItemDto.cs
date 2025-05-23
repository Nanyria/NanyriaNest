using FinalProjectLibrary.Models.Books.BookDTOs;
using FinalProjectLibrary.Models.Users.UserDTOs;

namespace FinalProjectLibrary.Models
{
    public class ReservationItemDto
    {

        public int Id { get; set; }
        public int BookId { get; set; }
        public SlimBookDto Book { get; set; }
        public DateTime ReservationDate { get; set; }
        public DateTime? AvailabilityDate { get; set; }
        public DateTime? BookIsAvaliableEmailSent { get; set; }
    }
}
