using FinalProjectLibrary.Models.Books;
using System.ComponentModel.DataAnnotations;

namespace FinalProjectLibrary.Models.Users.UserDTOs
{
    public class UpdateUserAsAdminDto
    {
        public string? UserName { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }

        public List<Book>? BorrowedBooks { get; set; } = new List<Book>();
        public List<Book>? ReservedBooks { get; set; } = new List<Book>();
        public List<UserHistory>? UserHistory { get; set; } = new List<UserHistory>();
    }
}
