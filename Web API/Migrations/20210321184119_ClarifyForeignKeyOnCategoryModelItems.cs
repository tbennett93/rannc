using Microsoft.EntityFrameworkCore.Migrations;

namespace Rannc.Migrations
{
    public partial class ClarifyForeignKeyOnCategoryModelItems : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CategoryItems_Categories_CategoryModelId",
                table: "CategoryItems");

            migrationBuilder.AlterColumn<long>(
                name: "CategoryModelId",
                table: "CategoryItems",
                type: "bigint",
                nullable: false,
                defaultValue: 0L,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_CategoryItems_Categories_CategoryModelId",
                table: "CategoryItems",
                column: "CategoryModelId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CategoryItems_Categories_CategoryModelId",
                table: "CategoryItems");

            migrationBuilder.AlterColumn<long>(
                name: "CategoryModelId",
                table: "CategoryItems",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(long),
                oldType: "bigint");

            migrationBuilder.AddForeignKey(
                name: "FK_CategoryItems_Categories_CategoryModelId",
                table: "CategoryItems",
                column: "CategoryModelId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
