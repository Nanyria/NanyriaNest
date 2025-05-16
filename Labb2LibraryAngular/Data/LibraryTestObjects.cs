using FinalProjectLibrary.Models.Books;
using FinalProjectLibrary.Models.History;
using FinalProjectLibrary.Helpers.Enums;

namespace FinalProjectLibrary.Data
{
    public static class LibraryTestObjects
    {
        public static List<Book> bookList = new List<Book>
        {
            new Book
            {
                BookID = 101,
                Title = "The Great Gatsby",
                Author = "F. Scott Fitzgerald",
                Genre = GenreEnums.Fiction,
                PublicationYear = 1925,
                BookDescription = "Lorem Ipsum",
                BookStatus = BookStatusEnum.Available,
            },
            new Book
            {
                BookID = 102,
                Title = "To Kill a Mockingbird",
                Author = "Harper Lee",
                Genre = GenreEnums.Fiction,
                PublicationYear = 1960,
                BookDescription = "Lorem Ipsum",
                BookStatus = BookStatusEnum.Available,
            },
            new Book
            {
                BookID = 103,
                Title = "1984",
                Author = "George Orwell",
                Genre = GenreEnums.Fiction,
                PublicationYear = 1949,
                BookDescription = "Lorem Ipsum",
                BookStatus = BookStatusEnum.Available,
            }
        };

        public static List<StatusHistoryItem> statusHistoryItems = new List<StatusHistoryItem>
        {
            new StatusHistoryItem
            {
                StatusHistoryItemID = 1,
                BookID = 101,
                BookStatus = BookStatusEnum.Available,
                Timestamp = DateTime.UtcNow.AddDays(-1),
                Notes = "Initial status"
            },
            new StatusHistoryItem
            {
                StatusHistoryItemID = 2,
                BookID = 102,
                BookStatus = BookStatusEnum.CheckedOut,
                Timestamp = DateTime.UtcNow.AddDays(-2),
                Notes = "Initial status"
            },
            new StatusHistoryItem
            {
                StatusHistoryItemID = 3,
                BookID = 103,
                BookStatus = BookStatusEnum.Reserved,
                Timestamp = DateTime.UtcNow.AddDays(-3),
                Notes = "Initial status"
            }
        };
    }
}
