using Microsoft.EntityFrameworkCore.Migrations;

namespace Rannc.Migrations
{
    public partial class CategoryItemsFKnowonCategoryGroups : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CategoryItems_Categories_CategoryModelId",
                table: "CategoryItems");

            migrationBuilder.DropColumn(
                name: "Group",
                table: "CategoryItems");

            migrationBuilder.RenameColumn(
                name: "CategoryModelId",
                table: "CategoryItems",
                newName: "CategoryGroupsId");

            migrationBuilder.RenameIndex(
                name: "IX_CategoryItems_CategoryModelId",
                table: "CategoryItems",
                newName: "IX_CategoryItems_CategoryGroupsId");

            migrationBuilder.AddForeignKey(
                name: "FK_CategoryItems_CategoryGroups_CategoryGroupsId",
                table: "CategoryItems",
                column: "CategoryGroupsId",
                principalTable: "CategoryGroups",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CategoryItems_CategoryGroups_CategoryGroupsId",
                table: "CategoryItems");

            migrationBuilder.RenameColumn(
                name: "CategoryGroupsId",
                table: "CategoryItems",
                newName: "CategoryModelId");

            migrationBuilder.RenameIndex(
                name: "IX_CategoryItems_CategoryGroupsId",
                table: "CategoryItems",
                newName: "IX_CategoryItems_CategoryModelId");

            migrationBuilder.AddColumn<string>(
                name: "Group",
                table: "CategoryItems",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_CategoryItems_Categories_CategoryModelId",
                table: "CategoryItems",
                column: "CategoryModelId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
