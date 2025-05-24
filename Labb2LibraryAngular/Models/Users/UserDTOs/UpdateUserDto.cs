using FinalProjectLibrary.Models.Books;

namespace FinalProjectLibrary.Models.Users.UserDTOs
{
    public class UpdateUserDto
    {
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? ProfilePictureUrl { get; set; } // Add this for profile picture selection
        public string? Bio { get; set; } // Add this for biograph

    }
}
