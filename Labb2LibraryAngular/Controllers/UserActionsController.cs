using Azure;
using FinalProjectLibrary.Helpers.Enums;
using FinalProjectLibrary.Models.Users;
using FinalProjectLibrary.Models.Users.UserDTOs;
using FinalProjectLibrary.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FinalProjectLibrary.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserActionsController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserActionsController(IUserService userService)
        {
            _userService = userService;
        }
        [HttpPut("update/{userId}")]
        public async Task<IActionResult> UpdateUser([FromRoute] string userId, [FromBody] UpdateUserDto updateUserDto)
        {
            var response = await _userService.UpdateUserAsync(userId, updateUserDto);
            return StatusCode((int)response.StatusCode, response);
        }

        [HttpPut("borrow/{userId}/{bookId}")]
        public async Task<IActionResult> BorrowBook([FromRoute] string userId, [FromRoute] int bookId)
        {
            var response = await _userService.CheckOutBookAsync(userId, bookId);
            return StatusCode((int)response.StatusCode, response);
        }

        [HttpPut("reserve/{userId}/{bookId}")]
        public async Task<IActionResult> ReserveBook([FromRoute] string userId, [FromRoute] int bookId)
        {
            var response = await _userService.ReserveBookAsync(userId, bookId);
            return StatusCode((int)response.StatusCode, response);
        }
        [HttpPut("unreserve/{userId}/{bookId}")]
        public async Task<IActionResult> UnreserveBook([FromRoute] string userId, [FromRoute] int bookId)
        {
            var response = await _userService.CancelReservationAsync(userId, bookId);
            return StatusCode((int)response.StatusCode, response);
        }

        [HttpPut("return/{userId}/{bookId}")]
        public async Task<IActionResult> ReturnBook([FromRoute] string userId, [FromRoute] int bookId)
        {
            var response = await _userService.ReturnBookAsync(userId, bookId);
            return StatusCode((int)response.StatusCode, response);
        }



        [HttpGet("reserved/{userId}")]
        public async Task<IActionResult> GetReservedBooks([FromRoute] string userId)
        {
            var response = await _userService.GetReservedBooksAsync(userId);
            return StatusCode((int)response.StatusCode, response);
        }
        [HttpGet("checkedout/{userId}")]
        public async Task<IActionResult> GetCheckedOutBooks([FromRoute] string userId)
        {
            var response = await _userService.GetCheckedOutBooksAsync(userId);
            return StatusCode((int)response.StatusCode, response);
        }
    }
}
