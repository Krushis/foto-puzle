using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FotoPuzleBackend.Migrations
{
    /// <inheritdoc />
    public partial class AddAspectRatioToPuzzles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AspectRatio",
                table: "Puzzles",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<bool>(
                name: "IsPublic",
                table: "Photos",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AspectRatio",
                table: "Puzzles");

            migrationBuilder.DropColumn(
                name: "IsPublic",
                table: "Photos");
        }
    }
}
