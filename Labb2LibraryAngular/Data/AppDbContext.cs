using FinalProjectLibrary.Helpers.Enums;
using FinalProjectLibrary.Models.Books;
using FinalProjectLibrary.Models.History;
using FinalProjectLibrary.Models.Users;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FinalProjectLibrary.Data
{
    public class AppDbContext : IdentityDbContext<User>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        public DbSet<Book> Books { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<StatusHistoryItem> StatusHistoryItems { get; set; }
        public DbSet<CheckedOutItem> CheckOutItems { get; set; }
        public DbSet<ReservationItem> ReservationItems { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {   
            base.OnModelCreating(modelBuilder);
        
        // ReservationItem relationships
        modelBuilder.Entity<ReservationItem>()
                .HasOne(r => r.User)
                .WithMany(u => u.ReservedBooks)
                .HasForeignKey(r => r.UserID)
                .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete

            modelBuilder.Entity<ReservationItem>()
                .HasOne(r => r.Book)
                .WithMany(b => b.Reservations)
                .HasForeignKey(r => r.BookID)
                .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete

            // CheckedOutItem relationships
            modelBuilder.Entity<CheckedOutItem>()
                .HasOne(c => c.User)
                .WithMany(u => u.CheckedOutBooks)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete

            modelBuilder.Entity<CheckedOutItem>()
                .HasOne(c => c.Book)
                .WithOne(b => b.CheckedOutBy)
                .HasForeignKey<CheckedOutItem>(c => c.BookId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete

            // StatusHistoryItem relationships
            modelBuilder.Entity<StatusHistoryItem>()
                .HasOne(sh => sh.Book)
                .WithMany(b => b.StatusHistory)
                .HasForeignKey(sh => sh.BookID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<StatusHistoryItem>()
                .HasOne(sh => sh.User)
                .WithMany(u => u.UserHistory)
                .HasForeignKey(sh => sh.UserID)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Book>()
                .Property(b => b.BookID)
                .ValueGeneratedOnAdd()
                .UseIdentityColumn(seed: 1001, increment: 1);

            modelBuilder.Entity<CheckedOutItem>()
                .Property(c => c.Id)
                .ValueGeneratedOnAdd()
                .UseIdentityColumn(seed: 1001, increment: 1);

            modelBuilder.Entity<ReservationItem>()
                .Property(r => r.ID)
                .ValueGeneratedOnAdd()
                .UseIdentityColumn(seed: 1001, increment: 1);

            modelBuilder.Entity<StatusHistoryItem>()
                .Property(sh => sh.StatusHistoryItemID)
                .ValueGeneratedOnAdd()
                .UseIdentityColumn(seed: 1001, increment: 1);


            modelBuilder.Entity<Book>().HasData(
                new Book
                {
                    BookID = 1001,
                    Title = "The Great Gatsby",
                    Author = "F. Scott Fitzgerald",
                    Genre = GenreEnums.Fiction,
                    PublicationYear = 1925,
                    BookDescription = "Lorem Ipsum",
                    BookType = BookTypeEnums.Hardcover,
                    BookStatus = BookStatusEnum.Available,
                },
                new Book
                {
                    BookID = 1002,
                    Title = "To Kill a Mockingbird",
                    Author = "Harper Lee",
                    Genre = GenreEnums.Fiction,
                    PublicationYear = 1960,
                    BookDescription = "Lorem Ipsum",
                    BookType = BookTypeEnums.Hardcover,
                    BookStatus = BookStatusEnum.Available,
                },
                new Book
                {
                    BookID = 1003,
                    Title = "1984",
                    Author = "George Orwell",
                    Genre = GenreEnums.Fiction,
                    PublicationYear = 1949,
                    BookDescription = "Lorem Ipsum",
                    BookType = BookTypeEnums.Paperback,
                    BookStatus = BookStatusEnum.Available,
                }
            );

            modelBuilder.Entity<StatusHistoryItem>().HasData(
                new StatusHistoryItem
                {
                    StatusHistoryItemID = 1001,
                    BookID = 1001,
                    BookStatus = BookStatusEnum.Available,  // Use an example status from BookStatusEnum
                    Timestamp = DateTime.UtcNow.AddDays(-1),
                    Notes = "Initial status"
                },
                new StatusHistoryItem
                {
                    StatusHistoryItemID = 1002,
                    BookID = 1002,
                    BookStatus = BookStatusEnum.CheckedOut,  // Example status
                    Timestamp = DateTime.UtcNow.AddDays(-2),
                    Notes = "Initial status"
                },
                new StatusHistoryItem
                {
                    StatusHistoryItemID = 1003,
                    BookID = 1003,
                    BookStatus = BookStatusEnum.Reserved,  // Example status
                    Timestamp = DateTime.UtcNow.AddDays(-3),
                    Notes = "Initial status"
                }
            );
        }
    }
}