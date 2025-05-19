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
                .ForMember(dest => dest.BookId, opt => opt.Ignore())
                .ForMember(dest => dest.StatusHistory, opt => opt.Ignore())
                .ForMember(dest => dest.Reservations, opt => opt.Ignore())
                .ForMember(dest => dest.CheckedOutBy, opt => opt.Ignore())
                .ForMember(dest => dest.Reviews, opt => opt.Ignore());

            CreateMap<Book, BookDto>()
                .ForMember(dest => dest.Title, opt => opt.MapFrom(src => src.Title))
                .ForMember(dest => dest.Author, opt => opt.MapFrom(src => src.Author))
                .ForMember(dest => dest.Genre, opt => opt.MapFrom(src => src.Genre))
                .ForMember(dest => dest.PublicationYear, opt => opt.MapFrom(src => src.PublicationYear))
                .ForMember(dest => dest.BookDescription, opt => opt.MapFrom(src => src.BookDescription))
                .ForMember(dest => dest.BookType, opt => opt.MapFrom(src => src.BookType))
                .ForMember(dest => dest.CoverImagePath, opt => opt.MapFrom(src => src.CoverImagePath));

            CreateMap<User, UserDto>()
                .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.CheckedOutBooks, opt => opt.MapFrom(src => src.CheckedOutBooks))
                .ForMember(dest => dest.ReservedBooks, opt => opt.MapFrom(src => src.ReservedBooks))
                .ForMember(dest => dest.UserHistory, opt => opt.MapFrom(src => src.UserHistory))
                .ForMember(dest => dest.ReadingList, opt => opt.MapFrom(src => src.ReadingList))
                .ForMember(dest => dest.Reviews, opt => opt.MapFrom(src => src.Reviews))
                .ForMember(dest => dest.Notifications, opt => opt.MapFrom(src => src.Notifications))
                .ReverseMap()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.UserId))
                .ForMember(dest => dest.CheckedOutBooks, opt => opt.Ignore())
                .ForMember(dest => dest.ReservedBooks, opt => opt.Ignore())
                .ForMember(dest => dest.UserHistory, opt => opt.Ignore())
                .ForMember(dest => dest.ReadingList, opt => opt.Ignore())
                .ForMember(dest => dest.Reviews, opt => opt.Ignore())
                .ForMember(dest => dest.Notifications, opt => opt.Ignore());

            CreateMap<User, CreateUserDto>();
            CreateMap<CreateUserDto, User>();


            CreateMap<User, UpdateUserAsAdminDto>();
            CreateMap<UpdateUserAsAdminDto, User>()
                            .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<User, UpdateUserDto>();
            CreateMap<UpdateUserDto, User>()
                .ForAllMembers(opts => opts.Condition((src, dest, srcMember) => srcMember != null));

            CreateMap<CreateAdminUserDto, User>().ReverseMap();

            CreateMap<StatusHistoryItem, StatusHistoryItemDto>().ReverseMap();
            CreateMap<ReservationItem, ReservationItemDto>()
                .ForMember(dest => dest.Book, opt => opt.MapFrom(src => src.Book))
                .ReverseMap()
                .ForMember(dest => dest.User, opt => opt.Ignore());
            CreateMap<CheckedOutItem, CheckedOutItemDto>()
                .ForMember(dest => dest.Book, opt => opt.MapFrom(src => src.Book))
                .ReverseMap()
                .ForMember(dest => dest.User, opt => opt.Ignore());

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
