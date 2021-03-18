using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Rannc.Migrations
{
    public partial class AddedPasswordSaltToLoginModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "LoginModel",
                keyColumn: "Id",
                keyValue: 1L);

            migrationBuilder.AddColumn<byte[]>(
                name: "PasswordSalt",
                table: "LoginModel",
                type: "varbinary(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PasswordSalt",
                table: "LoginModel");

            migrationBuilder.InsertData(
                table: "LoginModel",
                columns: new[] { "Id", "Password", "RefreshToken", "RefreshTokenExpiryTime", "UserName" },
                values: new object[] { 1L, "def@123", null, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "johndoe" });
        }
    }
}
