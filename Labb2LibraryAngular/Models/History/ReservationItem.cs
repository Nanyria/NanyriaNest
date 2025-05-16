using FinalProjectLibrary.Models.Books;
using FinalProjectLibrary.Models.Users;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace FinalProjectLibrary.Models.History
{
    public class ReservationItem
    {
        [Key]
        public int ID { get; set; }
        [Required]
        [ForeignKey("User")]
        public string UserID { get; set; }
        [JsonIgnore]
        public User User { get; set; }
        [Required]
        [ForeignKey("Book")]
        public int BookID { get; set; }
        [JsonIgnore]
        public Book Book { get; set; }
        public DateTime ReservationDate { get; set; }

        public DateTime? AvailabilityDate { get; set; }

        public DateTime? BookIsAvaliableEmailSent { get; set; }
    }
}
