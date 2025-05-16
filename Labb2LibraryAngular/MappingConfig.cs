using AutoMapper;
using FinalProjectLibrary.Models;
using FinalProjectLibrary.Models.Books;
using FinalProjectLibrary.Models.Books.BookDTOs;
using FinalProjectLibrary.Models.History;
using FinalProjectLibrary.Models.History.HistoryDTOs;
using FinalProjectLibrary.Models.Users;
using FinalProjectLibrary.Models.Users.UserDTOs;
using static FinalProjectLibrary.Models.Books.BookDTOs.BookDto;

namespace FinalProjectLibrary
{
    public class MappingConfig : Profile
    {
        public MappingConfig()
        {
            CreateMap<BookDto, Book>()
                .ForMember(dest => dest.BookID, opt => opt.Ignore()) // Ignore BookID during mapping
                .ForMember(dest => dest.StatusHistory, opt => opt.Ignore()) // Ignore lists
                .ForMember(dest => dest.Reservations, opt => opt.Ignore())
                .ForMember(dest => dest.CheckedOutBy, opt => opt.Ignore());

            CreateMap<Book, BookDto>();

            CreateMap<User, UserDto>()
                .ReverseMap()
                .ForMember(dest => dest.CheckedOutBooks, opt => opt.Ignore())
                .ForMember(dest => dest.ReservedBooks, opt => opt.Ignore())
                .ForMember(dest => dest.UserHistory, opt => opt.Ignore());

            CreateMap<User, CreateUserDto>();
            CreateMap<CreateUserDto, User>();
            CreateMap<User, UpdateUserAsAdminDto>().ReverseMap();
            CreateMap<User, UpdateUserDto>().ReverseMap();

            CreateMap<CreateAdminUserDto, User>().ReverseMap();

            CreateMap<StatusHistoryItem, StatusHistoryItemDto>().ReverseMap();
            CreateMap<ReservationItem, ReservationItemDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserName)) // Map UserName
                .ForMember(dest => dest.BookTitle, opt => opt.MapFrom(src => src.Book.Title))   // Map BookTitle
                .ReverseMap();
            CreateMap<CheckedOutItem, CheckedOutItemDto>()
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserName)) // Map UserName
                .ForMember(dest => dest.BookTitle, opt => opt.MapFrom(src => src.Book.Title))   // Map BookTitle
                .ReverseMap();

            //// Update for BookStatus - Map StatusHistoryItem from DTO
            //CreateMap<BookDto, Book>()
            //    .ForMember(dest => dest.StatusHistory, opt => opt.MapFrom(src =>
            //        new List<StatusHistoryItem>
            //        {
            //        new StatusHistoryItem
            //        {
            //            BookStatus = src.BookStatus, // Map the BookStatus from DTO
            //            Timestamp = DateTime.UtcNow, // Timestamp when the status is updated
            //        }
            //        }))
            //    .ForMember(dest => dest.Title, opt => opt.Ignore())       // Explicitly ignore unwanted fields
            //    .ForMember(dest => dest.Author, opt => opt.Ignore())
            //    .ForMember(dest => dest.Genre, opt => opt.Ignore())
            //    .ForMember(dest => dest.PublicationYear, opt => opt.Ignore())
            //    .ForMember(dest => dest.BookDescription, opt => opt.Ignore())
            //    .ReverseMap();
        }
    }
}
