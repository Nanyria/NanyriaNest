using FinalProjectLibrary.Models.Users;
using Microsoft.AspNetCore.Identity;

namespace FinalProjectLibrary.Helpers
{
    public class Helper
    {
        public static class IdentityDataInitializer
        {
            public static async Task SeedRolesAndAdminAsync(IServiceProvider serviceProvider)
            {
                var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
                var userManager = serviceProvider.GetRequiredService<UserManager<User>>();

                string[] roles = { "SuperAdmin", "Librarian" };
                foreach (var role in roles)
                {
                    if (!await roleManager.RoleExistsAsync(role))
                        await roleManager.CreateAsync(new IdentityRole(role));
                }

                var superAdminEmail = "nathaleewi@hotmail.com";
                var superAdminUser = await userManager.FindByEmailAsync(superAdminEmail);
                if (superAdminUser == null)
                {
                    superAdminUser = new User
                    {
                        UserName = "Nanyria",
                        Email = superAdminEmail,
                        FirstName = "Nathalee",
                        LastName = "Wilund",
                        EmailConfirmed = true
                    };
                    var createResult = await userManager.CreateAsync(superAdminUser, "SuperSecurePassword123!");
                    if (!createResult.Succeeded)
                    {
                        // Log or throw the errors for debugging
                        var errors = string.Join(", ", createResult.Errors.Select(e => e.Description));
                        throw new Exception($"Failed to create SuperAdmin user: {errors}");
                    }
                    await userManager.AddToRoleAsync(superAdminUser, "SuperAdmin");
                }
            
            }
        }


    }
}
