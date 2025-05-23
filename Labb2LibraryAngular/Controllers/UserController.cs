using Azure;
using FinalProjectLibrary.Helpers.Enums;
using FinalProjectLibrary.Models.Users;
using FinalProjectLibrary.Models.Users.UserDTOs;
using FinalProjectLibrary.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinalProjectLibrary.Controllers
{
    [Authorize(Roles = AdminRoles.SuperAdmin + "," + AdminRoles.Librarian)]
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var response = await _userService.GetAllUsersAsync();
            return StatusCode((int)response.StatusCode, response);
        }
        [HttpPost]
        public async Task<IActionResult> AddUser([FromBody] CreateUserDto createUserDto)
        {
            var response = await _userService.AddUserAsync(createUserDto);
            return StatusCode((int)response.StatusCode, response);
        }
        [Authorize(Roles = AdminRoles.SuperAdmin)]
        [HttpPost("create-admin")]
        public async Task<IActionResult> CreateAdminUser([FromBody] CreateAdminUserDto adminUserDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var response = await _userService.CreateAdminUserAsync(adminUserDto);
            return StatusCode((int)response.StatusCode, response);
        }
        [HttpDelete("{userId}")]
        public async Task<IActionResult> DeleteUser([FromRoute] string userId)
        {
            var response = await _userService.DeleteUserAsync(userId);
            return StatusCode((int)response.StatusCode, response);
        }
        [HttpPut("updateAsAdmin/{userId}")]
        public async Task<IActionResult> UpdateUserAsAdmin([FromRoute] string userId, [FromBody] UpdateUserAsAdminDto updateUserDto)
        {
            var response = await _userService.UpdateUserAsAdminAsync(userId, updateUserDto);
            return StatusCode((int)response.StatusCode, response);
        }

        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserById([FromRoute] string userId)
        {
            var response = await _userService.GetUserByIdAsync(userId);
            return StatusCode((int)response.StatusCode, response);
        }


        [HttpGet("history/{userId}")]
        public async Task<IActionResult> GetUserHistory([FromRoute] string userId)
        {
            var response = await _userService.GetUserHistoryAsync(userId);
            return StatusCode((int)response.StatusCode, response);
        }
    }
}
