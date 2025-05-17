﻿using FinalProjectLibrary.Helpers.Enums;
using FinalProjectLibrary.Models;
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
        public DbSet<ReviewItem> ReviewItems { get; set; }
        public DbSet<RatingItem> RatingItems { get; set; }
        public DbSet<FavoriteItem> FavoriteItems { get; set; }
        public DbSet<StatusHistoryItem> StatusHistoryItems { get; set; }
        public DbSet<CheckedOutItem> CheckOutItems { get; set; }
        public DbSet<ReservationItem> ReservationItems { get; set; }
        public DbSet<NotificationItem> NotificationItems { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {   
            base.OnModelCreating(modelBuilder);

            // ReviewItem: User (many reviews per user)
            modelBuilder.Entity<ReviewItem>()
                .HasOne(r => r.User)
                .WithMany(u => u.Reviews)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // ReviewItem: Book (many reviews per book)
            modelBuilder.Entity<ReviewItem>()
                .HasOne(r => r.Book)
                .WithMany(b => b.Reviews) // <-- Reference the Reviews collection
                .HasForeignKey(r => r.BookId)
                .OnDelete(DeleteBehavior.Cascade);

            // RatingItem: ReviewItem (1:1)
            modelBuilder.Entity<RatingItem>()
                .HasOne(r => r.ReviewItem)
                .WithOne(r => r.RatingItem)
                .HasForeignKey<RatingItem>(r => r.ReviewItemId)
                .OnDelete(DeleteBehavior.Cascade);

            // FavoriteItem: User (many favorites per user)
            modelBuilder.Entity<FavoriteItem>()
                .HasOne(f => f.User)
                .WithMany(u => u.ReadingList)
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            // FavoriteItem: Book (many favorites per book, but Book does not need navigation)
            modelBuilder.Entity<FavoriteItem>()
                .HasOne(f => f.Book)
                .WithMany()
                .HasForeignKey(f => f.BookId)
                .OnDelete(DeleteBehavior.Cascade);
            // ReservationItem relationships
            modelBuilder.Entity<ReservationItem>()
                .HasOne(r => r.User)
                .WithMany(u => u.ReservedBooks)
                .HasForeignKey(r => r.UserId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent cascade delete

            modelBuilder.Entity<ReservationItem>()
                .HasOne(r => r.Book)
                .WithMany(b => b.Reservations)
                .HasForeignKey(r => r.BookId)
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
                .HasForeignKey(sh => sh.BookId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<StatusHistoryItem>()
                .HasOne(sh => sh.User)
                .WithMany(u => u.UserHistory)
                .HasForeignKey(sh => sh.UserId)
                .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.Entity<NotificationItem>()
                .HasOne(n => n.User)
                .WithMany(u => u.Notifications)
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Book>()
                .Property(b => b.BookId)
                .ValueGeneratedOnAdd()
                .UseIdentityColumn(seed: 1001, increment: 1);

            modelBuilder.Entity<CheckedOutItem>()
                .Property(c => c.Id)
                .ValueGeneratedOnAdd()
                .UseIdentityColumn(seed: 1001, increment: 1);

            modelBuilder.Entity<ReservationItem>()
                .Property(r => r.Id)
                .ValueGeneratedOnAdd()
                .UseIdentityColumn(seed: 1001, increment: 1);

            modelBuilder.Entity<StatusHistoryItem>()
                .Property(sh => sh.StatusHistoryItemId)
                .ValueGeneratedOnAdd()
                .UseIdentityColumn(seed: 1001, increment: 1);

            modelBuilder.Entity<ReviewItem>()
                .Property(r => r.Id)
                .ValueGeneratedOnAdd()
                .UseIdentityColumn(seed: 1001, increment: 1);

            modelBuilder.Entity<RatingItem>()
                .Property(r => r.Id)
                .ValueGeneratedOnAdd()
                .UseIdentityColumn(seed: 1001, increment: 1);

            modelBuilder.Entity<FavoriteItem>()
                .Property(r => r.Id)
                .ValueGeneratedOnAdd()
                .UseIdentityColumn(seed: 1001, increment: 1);


            modelBuilder.Entity<Book>().HasData(
                new Book
                {
                    BookId = 1001,
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
                    BookId = 1002,
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
                    BookId = 1003,
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
                    StatusHistoryItemId = 1001,
                    BookId = 1001,
                    BookStatus = BookStatusEnum.Available,  // Use an example status from BookStatusEnum
                    Timestamp = DateTime.UtcNow.AddDays(-1),
                    Notes = "Initial status"
                },
                new StatusHistoryItem
                {
                    StatusHistoryItemId = 1002,
                    BookId = 1002,
                    BookStatus = BookStatusEnum.CheckedOut,  // Example status
                    Timestamp = DateTime.UtcNow.AddDays(-2),
                    Notes = "Initial status"
                },
                new StatusHistoryItem
                {
                    StatusHistoryItemId = 1003,
                    BookId = 1003,
                    BookStatus = BookStatusEnum.Reserved,  // Example status
                    Timestamp = DateTime.UtcNow.AddDays(-3),
                    Notes = "Initial status"
                }
            );
        }
    }
}