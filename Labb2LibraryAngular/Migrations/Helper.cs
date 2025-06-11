using FinalProjectLibrary.Helpers.Enums;
using FinalProjectLibrary.Models.Users;
using Microsoft.AspNetCore.Identity;

namespace FinalProjectLibrary.Helpers
{
    public static class Helper
    {
        public static async Task SeedRolesAndAdminAsync(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<User>>();

            string[] roles = { "SuperAdmin", "Administratör", "Användare" };
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
                    EmailConfirmed = true,
                    Role = "SuperAdmin"
                };
                var createResult = await userManager.CreateAsync(superAdminUser, "SuperSecurePassword123!!");
                if (!createResult.Succeeded)
                {
                    // Log or throw the errors for debugging
                    var errors = string.Join(", ", createResult.Errors.Select(e => e.Description));
                    throw new Exception($"Failed to create SuperAdmin user: {errors}");
                }
                await userManager.AddToRoleAsync(superAdminUser, "SuperAdmin");
            }

        }
        public static async Task AssignUserRoleToUsersWithoutRoleAsync(IServiceProvider serviceProvider)
        {
            var userManager = serviceProvider.GetRequiredService<UserManager<User>>();
            var users = userManager.Users.ToList();

            foreach (var user in users)
            {
                var roles = await userManager.GetRolesAsync(user);
                if (roles == null || roles.Count == 0)
                {
                    await userManager.AddToRoleAsync(user, Roles.User); // "Användare"

                }
                user.Role = roles != null && roles.Count > 0 ? roles[0] : Roles.User;
                await userManager.UpdateAsync(user);
            }
        }
    }

}
