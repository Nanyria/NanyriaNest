using FinalProjectLibrary.Helpers.Enums;
using FinalProjectLibrary.Models.Books.BookDTOs;
using FinalProjectLibrary.Models.Users.UserDTOs;


namespace FinalProjectLibrary.Models.History.HistoryDTOs
{
    public class StatusHistoryItemDto
    {
        public int StatusHistoryItemId { get; set; }
        public BookStatusEnum BookStatus { get; set; }
        public DateTime? Timestamp { get; set; } = DateTime.UtcNow;
        public string? UserID { get; set; } 
        public int? BookID { get; set; }
        public SlimBookDto? Book { get; set; }
        public string? Notes { get; set; }
    }
}
