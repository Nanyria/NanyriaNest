using FinalProjectLibrary.Helpers.Enums;
using FinalProjectLibrary.Models.Books;
using FinalProjectLibrary.Models.Books.BookDTOs;
using FinalProjectLibrary.Models.Users;
using FinalProjectLibrary.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static FinalProjectLibrary.Models.Books.BookDTOs.BookDto;

[Route("api/[controller]")]
[ApiController]
public class LibraryController : ControllerBase
{
    private readonly IBookService _bookService;
    private readonly IUserService _userService;
    public LibraryController(IBookService bookService, IUserService userService)
    {
        _bookService = bookService;
        _userService = userService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllBooks()
    {
        var response = await _bookService.GetAllBooksAsync();

        return StatusCode((int)response.StatusCode, response);
    }



    [HttpGet("title/{title}")]
    public async Task<IActionResult> GetBooksByTitle(string title)
    {
        var response = await _bookService.GetBooksByTitleAsync(title);
        return StatusCode((int)response.StatusCode, response);
    }

    [HttpGet("author/{author}")]
    public async Task<IActionResult> GetBooksByAuthor(string author)
    {
        var response = await _bookService.GetBooksByAuthorAsync(author);
        return StatusCode((int)response.StatusCode, response);
    }


    [HttpGet("reservations/{bookId:int}")]
    public async Task<IActionResult> GetBookReservations(int bookId)
    {
        var response = await _bookService.GetBookReservationsAsync(bookId);
        return StatusCode((int)response.StatusCode, response);
    }
    [HttpGet("booksbygenre/{genre}")]
    public async Task<IActionResult> GetBooksByGenre(GenreEnums genre, [FromQuery] string sortBy = "Title", [FromQuery] bool ascending = true)
    {
        var response = await _bookService.GetBooksByGenreAsync(genre, sortBy, ascending);
        return StatusCode((int)response.StatusCode, response);
    }
    [HttpGet("review/{bookId:int}")]
    public async Task<IActionResult> GetBookReview(int bookId)
    {
        var response = await _bookService.GetBookReviewsAsync(bookId);
        return StatusCode((int)response.StatusCode, response);
    }

}
