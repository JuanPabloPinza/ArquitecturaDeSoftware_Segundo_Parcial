using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API_DOTNET_BANK.Migrations
{
    /// <inheritdoc />
    public partial class AddBranchEntityWithCoordinates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "address",
                table: "branches");

            migrationBuilder.DropColumn(
                name: "city",
                table: "branches");

            migrationBuilder.AddColumn<double>(
                name: "latitude",
                table: "branches",
                type: "double",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "longitude",
                table: "branches",
                type: "double",
                nullable: false,
                defaultValue: 0.0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "latitude",
                table: "branches");

            migrationBuilder.DropColumn(
                name: "longitude",
                table: "branches");

            migrationBuilder.AddColumn<string>(
                name: "address",
                table: "branches",
                type: "varchar(255)",
                maxLength: 255,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "city",
                table: "branches",
                type: "varchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
