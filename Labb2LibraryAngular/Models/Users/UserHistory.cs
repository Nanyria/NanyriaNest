using FinalProjectLibrary.Helpers.Enums;
using FinalProjectLibrary.Models.Books;

namespace FinalProjectLibrary.Models.Users
{
    public class UserHistory
    {
        public int UserHistoryID { get; set; }
        public int UserID { get; set; }
        public required User User { get; set; }
        public int BookID { get; set; }

        public required Book Book { get; set; }
        public BookStatusEnum Action { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public string? Notes { get; set; }

    }
}
