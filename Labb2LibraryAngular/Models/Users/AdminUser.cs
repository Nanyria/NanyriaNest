namespace FinalProjectLibrary.Models.Users
{
    public class AdminUser : User
    {
        public required string AdminRole { get; set; } // e.g., "SuperAdmin", "Librarian"

        // Additional properties and methods specific to admin users can be added here
        // For example, methods for managing user accounts, books, etc.
    
    }
}
