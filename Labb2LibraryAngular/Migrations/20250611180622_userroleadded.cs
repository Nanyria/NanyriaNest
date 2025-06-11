using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FinalProjectLibrary.Migrations
{
    /// <inheritdoc />
    public partial class userroleadded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "StatusHistoryItems",
                keyColumn: "StatusHistoryItemId",
                keyValue: 1001);

            migrationBuilder.DeleteData(
                table: "StatusHistoryItems",
                keyColumn: "StatusHistoryItemId",
                keyValue: 1002);

            migrationBuilder.DeleteData(
                table: "StatusHistoryItems",
                keyColumn: "StatusHistoryItemId",
                keyValue: 1003);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "BookId",
                keyValue: 1001);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "BookId",
                keyValue: 1002);

            migrationBuilder.DeleteData(
                table: "Books",
                keyColumn: "BookId",
                keyValue: 1003);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Books",
                columns: new[] { "BookId", "Author", "AvailabilityDate", "BookDescription", "BookStatus", "BookType", "CoverImagePath", "Genre", "PublicationYear", "Title" },
                values: new object[,]
                {
                    { 1001, "F. Scott Fitzgerald", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Lorem Ipsum", 0, 2, null, 9, 1925, "The Great Gatsby" },
                    { 1002, "Harper Lee", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Lorem Ipsum", 0, 2, null, 9, 1960, "To Kill a Mockingbird" },
                    { 1003, "George Orwell", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "Lorem Ipsum", 0, 1, null, 9, 1949, "1984" }
                });

            migrationBuilder.InsertData(
                table: "StatusHistoryItems",
                columns: new[] { "StatusHistoryItemId", "BookId", "BookStatus", "Notes", "Timestamp", "UserId" },
                values: new object[,]
                {
                    { 1001, 1001, 0, "Initial status", new DateTime(2025, 6, 10, 17, 44, 0, 751, DateTimeKind.Utc).AddTicks(7400), null },
                    { 1002, 1002, 2, "Initial status", new DateTime(2025, 6, 9, 17, 44, 0, 751, DateTimeKind.Utc).AddTicks(7404), null },
                    { 1003, 1003, 1, "Initial status", new DateTime(2025, 6, 8, 17, 44, 0, 751, DateTimeKind.Utc).AddTicks(7406), null }
                });
        }
    }
}
