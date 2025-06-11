using FinalProjectLibrary.Helpers.Enums;
using FinalProjectLibrary.Models.Books;
using FinalProjectLibrary.Models.Books.BookDTOs;
using FinalProjectLibrary.Models.Users;
using FinalProjectLibrary.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


[Authorize(Roles = Roles.SuperAdmin + "," + Roles.Admin)]
[Route("api/[controller]")]
[ApiController]
public class BookController : ControllerBase
{
    private readonly IBookService _bookService;
    private readonly IUserService _userService;
    public BookController(IBookService bookService, IUserService userService)
    {
        _bookService = bookService;
        _userService = userService;
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetBookByID(int id)
    {
        var response = await _bookService.GetBookByIdAsync(id);
        return StatusCode((int)response.StatusCode, response);
    }
    [HttpPost]
    public async Task<IActionResult> AddBook([FromBody] SlimBookDto book)
    {
        var response = await _bookService.AddBookAsync(book);
        return StatusCode((int)response.StatusCode, response);
    }

    [HttpDelete("{bookId:int}")]
    public async Task<IActionResult> DeleteBook(int bookId)
    {
        var response = await _bookService.DeleteBookAsync(bookId);
        return StatusCode((int)response.StatusCode, response);
    }

    [HttpPut("{bookId:int}")]
    public async Task<IActionResult> UpdateBookInfo(int bookId, [FromBody] BookDto bookInfo)
    {
        var response = await _bookService.UpdateBookInfoAsync(bookId, bookInfo);
        return StatusCode((int)response.StatusCode, response);
    }


    [HttpPut("status/{bookId:int}")]
    public async Task<IActionResult> UpdateBookStatus(int bookId, string userId, BookStatusEnum bookStatus, string? notes)
    {
        var bookResponse = await _bookService.GetBookByIdAsync(bookId);
        if (!bookResponse.IsSuccess)
        {
            return StatusCode((int)bookResponse.StatusCode, bookResponse);
        }


        var response = await _bookService.UpdateBookStatusAsync(bookResponse.Result, userId, bookStatus, notes);
        return StatusCode((int)response.StatusCode, response);
    }

    [HttpGet("history/{bookId:int}")]
    public async Task<IActionResult> GetBookHistory(int bookId)
    {
        var response = await _bookService.GetBookHistoryAsync(bookId);
        return StatusCode((int)response.StatusCode, response);
    }




}
