using NyriaNest.Api.Models.Books;
using System.ComponentModel.DataAnnotations;

namespace NyriaNest.Api.Models.Users.UserDTOs
{
    public class CreateUserDto
    {
        public required string UserName { get; set; }
        public required string FirstName { get; set; }
        public required string LastName { get; set; }
        public required string Email { get; set; }
        public required string Password { get; set; }
        public required string Role { get; set; }
    }
}
