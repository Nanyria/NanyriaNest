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
                BookId = 101,
                Title = "The Great Gatsby",
                Author = "F. Scott Fitzgerald",
                Genre = GenreEnums.Fiction,
                PublicationYear = 1925,
                BookDescription = "Lorem Ipsum",
                BookStatus = BookStatusEnum.Available,
            },
            new Book
            {
                BookId = 102,
                Title = "To Kill a Mockingbird",
                Author = "Harper Lee",
                Genre = GenreEnums.Fiction,
                PublicationYear = 1960,
                BookDescription = "Lorem Ipsum",
                BookStatus = BookStatusEnum.Available,
            },
            new Book
            {
                BookId = 103,
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
                StatusHistoryItemId = 1,
                BookId = 101,
                BookStatus = BookStatusEnum.Available,
                Timestamp = DateTime.UtcNow.AddDays(-1),
                Notes = "Initial status"
            },
            new StatusHistoryItem
            {
                StatusHistoryItemId = 2,
                BookId = 102,
                BookStatus = BookStatusEnum.CheckedOut,
                Timestamp = DateTime.UtcNow.AddDays(-2),
                Notes = "Initial status"
            },
            new StatusHistoryItem
            {
                StatusHistoryItemId = 3,
                BookId = 103,
                BookStatus = BookStatusEnum.Reserved,
                Timestamp = DateTime.UtcNow.AddDays(-3),
                Notes = "Initial status"
            }
        };
    }
}
