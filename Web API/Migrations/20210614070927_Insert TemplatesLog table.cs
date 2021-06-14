using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Rannc.Migrations
{
    public partial class InsertTemplatesLogtable : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TemplatesLog",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CategoryModelId = table.Column<long>(type: "bigint", nullable: false),
                    DateSaved = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TemplatesLog", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TemplatesLog_Categories_CategoryModelId",
                        column: x => x.CategoryModelId,
                        principalTable: "Categories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TemplatesLog_CategoryModelId",
                table: "TemplatesLog",
                column: "CategoryModelId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TemplatesLog");
        }
    }
}
