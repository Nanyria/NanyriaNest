using FinalProjectLibrary.Helpers.Enums;
using FinalProjectLibrary.Models.History;
using FinalProjectLibrary.Models.History.HistoryDTOs;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace FinalProjectLibrary.Models.Books.BookDTOs
{
    //public class BookDto
    //{
    //    public int BookID { get; set; }
    //    public required string Title { get; set; }
    //    public required string Author { get; set; }
    //    public required GenreEnums Genre { get; set; }
    //    public string GenreName => Genre.ToString();
    //    public string? BookDescription { get; set; }
    //    public int PublicationYear { get; set; }
    //    public BookStatusEnum BookStatus { get; set; }
    //    public string BookStatusName => BookStatus.ToString();
    //    public List<StatusHistoryItemDto> StatusHistory { get; set; } = new();
    //    public List<ReservationItemDto> Reservations { get; set; } = new();
    //    public CheckedOutItemDto? CheckedOutBy { get; set; }
    //}

    public class BookDto
    {
        [Required]
        [MaxLength(100)]
        public required string Title { get; set; }

        [Required]
        [MaxLength(75)]
        public required string Author { get; set; }

        public GenreEnums Genre { get; set; }
        public int PublicationYear { get; set; }
        public string? BookDescription { get; set; }
        public BookTypeEnums BookType { get; set; }
        public DateTime AvailabilityDate { get; set; }
        public string? CoverImagePath { get; set; }
    }
    //public class CreateBookDto
    //{
    //    [Required]
    //    public string Title { get; set; }
    //    [Required]
    //    public string Author { get; set; }
    //    [Required]
    //    public GenreEnums Genre { get; set; }
    //    public string? BookDescription { get; set; }
    //    public int PublicationYear { get; set; }

    //    public List<StatusHistoryItem> StatusHistory { get; set; } = new();
    //    public BookStatusEnum BookStatus { get; set; } = BookStatusEnum.Available;
    //    public List<ReservationItemDto>? Reservations { get; set; } = new();
    //    public CheckedOutItemDto? CheckedOutBy { get; set; }

    //}
    //public class UpdateBookInfoDTO
    //{

    //    [Required]
    //    public string Title { get; set; }
    //    [Required]
    //    public string Author { get; set; }
    //    [Required]
    //    public GenreEnums Genre { get; set; }
    //    public int PublicationYear { get; set; }
    //    public string BookDescription { get; set; }

    //}
    public class UpdateBookStatusDTO
    {

        public int BookID { get; set; }
        public BookStatusEnum BookStatus { get; set; }
        public DateTime AvailabilityDate { get; set; }
        public CheckedOutItemDto? CheckedOutBy { get; set; }
        public List<StatusHistoryItemDto> StatusHistory { get; set; } = new();
        public List<ReservationItemDto> Reservations { get; set; } = new();

    }
}

