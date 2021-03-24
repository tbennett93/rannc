using Microsoft.EntityFrameworkCore.Migrations;

namespace Rannc.Migrations
{
    public partial class CategoriesTableCorrection : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Comment",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "Order",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Categories");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Comment",
                table: "Categories",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Order",
                table: "Categories",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Categories",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
