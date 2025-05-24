using Azure;
using FinalProjectLibrary.Helpers.Enums;
using FinalProjectLibrary.Models;
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
        private readonly IUserActionsService _userActionsService;

        public UserActionsController(IUserService userService, IUserActionsService userActionsService)
        {
            _userService = userService;
            _userActionsService = userActionsService;
        }
        [HttpPut("update/{userId}")]
        public async Task<IActionResult> UpdateUser([FromRoute] string userId, [FromBody] UpdateUserDto updateUserDto)
        {
            var response = await _userService.UpdateUserAsync(userId, updateUserDto);
            return StatusCode((int)response.StatusCode, response);
        }

        // Borrow methods

        [HttpGet("checkedout/{userId}")]
        public async Task<IActionResult> GetCheckedOutBooks([FromRoute] string userId)
        {
            var response = await _userActionsService.GetCheckedOutBooksAsync(userId);
            return StatusCode((int)response.StatusCode, response);
        }

        [HttpPut("borrow/{userId}/{bookId}")]
        public async Task<IActionResult> BorrowBook([FromRoute] string userId, [FromRoute] int bookId)
        {
            var response = await _userActionsService.CheckOutBookAsync(userId, bookId);
            return StatusCode((int)response.StatusCode, response);
        }

        [HttpPut("return/{userId}/{bookId}")]
        public async Task<IActionResult> ReturnBook([FromRoute] string userId, [FromRoute] int bookId)
        {
            var response = await _userActionsService.ReturnBookAsync(userId, bookId);
            return StatusCode((int)response.StatusCode, response);
        }


        // Reserve methods

        [HttpGet("reserved/{userId}")]
        public async Task<IActionResult> GetReservedBooks([FromRoute] string userId)
        {
            var response = await _userActionsService.GetReservedBooksAsync(userId);
            return StatusCode((int)response.StatusCode, response);
        }
        [HttpPut("reserve/{userId}/{bookId}")]
        public async Task<IActionResult> ReserveBook([FromRoute] string userId, [FromRoute] int bookId)
        {
            var response = await _userActionsService.ReserveBookAsync(userId, bookId);
            return StatusCode((int)response.StatusCode, response);
        }
        [HttpPut("unreserve/{userId}/{bookId}")]
        public async Task<IActionResult> UnreserveBook([FromRoute] string userId, [FromRoute] int bookId)
        {
            var response = await _userActionsService.CancelReservationAsync(userId, bookId);
            return StatusCode((int)response.StatusCode, response);
        }

        // Review methods
        [HttpGet("reviews/{userId}")]
        public async Task<IActionResult> GetUserReviews([FromRoute] string userId)
        {
            var response = await _userActionsService.GetUserReviewsAsync(userId);
            return StatusCode((int)response.StatusCode, response);
        }
        [HttpPost("newReview")]
        public async Task<IActionResult> CreateReview([FromBody] CreateReviewItemDto createReviewDto)
        {
            var response = await _userActionsService.CreateReviewAsync(createReviewDto);
            return StatusCode((int)response.StatusCode, response);
        }
        [HttpPut("editReview/{reviewId}")]
        public async Task<IActionResult> EditReview([FromRoute] int reviewId, [FromBody] ReviewItemDto updateReviewDto)
        {
            var response = await _userActionsService.EditReviewAsync(reviewId, updateReviewDto);
            return StatusCode((int)response.StatusCode, response);
        }
        [HttpDelete("deleteReview/{reviewId}")]
        public async Task<IActionResult> DeleteReview([FromRoute] int reviewId)
        {
            var response = await _userActionsService.RemoveReviewItemAsync(reviewId);
            return StatusCode((int)response.StatusCode, response);
        }

        // Rating methods
        [HttpPut("editRating/{reviewId}")]
        public async Task<IActionResult> EditRating([FromRoute] int reviewId, [FromBody] RatingItemDto ratingDto)
        {
            var response = await _userActionsService.EditRatingAsync(reviewId, ratingDto);
            return StatusCode((int)response.StatusCode, response);
        }
        [HttpDelete("deleteRating/{reviewId}")]
        public async Task<IActionResult> DeleteRating([FromRoute] int reviewId)
        {
            var response = await _userActionsService.RemoveRatingAsync(reviewId);
            return StatusCode((int)response.StatusCode, response);
        }

        // Favorite methods

        [HttpGet("favorites/{userId}")]
        public async Task<IActionResult> GetFavoriteBooks([FromRoute] string userId)
        {
            var response = await _userActionsService.GetFavoriteItemsAsync(userId);
            return StatusCode((int)response.StatusCode, response);
        }

        [HttpPut("favorite/{userId}/{bookId}")]
        public async Task<IActionResult> AddToFavorites([FromRoute] string userId, [FromRoute] int bookId)
        {
            var response = await _userActionsService.AddToFavoritesAsync(userId, bookId);
            return StatusCode((int)response.StatusCode, response);
        }
        [HttpDelete("unfavorite/{userId}/{bookId}")]
        public async Task<IActionResult> RemoveFromFavorites([FromRoute] string userId, [FromRoute] int bookId)
        {
            var response = await _userActionsService.RemoveFromFavoritesAsync(userId, bookId);
            return StatusCode((int)response.StatusCode, response);
        }

    }
}
