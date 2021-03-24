using Microsoft.EntityFrameworkCore.Migrations;

namespace Rannc.Migrations
{
    public partial class AddLoginModelIdToModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Categories_LoginModel_LoginModelId",
                table: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Categories_LoginModelId",
                table: "Categories");

            migrationBuilder.AlterColumn<int>(
                name: "LoginModelId",
                table: "Categories",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(long),
                oldType: "bigint",
                oldNullable: true);

            migrationBuilder.AddColumn<long>(
                name: "LoginModelId1",
                table: "Categories",
                type: "bigint",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Categories_LoginModelId1",
                table: "Categories",
                column: "LoginModelId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Categories_LoginModel_LoginModelId1",
                table: "Categories",
                column: "LoginModelId1",
                principalTable: "LoginModel",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Categories_LoginModel_LoginModelId1",
                table: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Categories_LoginModelId1",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "LoginModelId1",
                table: "Categories");

            migrationBuilder.AlterColumn<long>(
                name: "LoginModelId",
                table: "Categories",
                type: "bigint",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_Categories_LoginModelId",
                table: "Categories",
                column: "LoginModelId");

            migrationBuilder.AddForeignKey(
                name: "FK_Categories_LoginModel_LoginModelId",
                table: "Categories",
                column: "LoginModelId",
                principalTable: "LoginModel",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
