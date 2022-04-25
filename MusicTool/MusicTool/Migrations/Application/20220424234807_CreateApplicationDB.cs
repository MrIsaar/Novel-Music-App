using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MusicTool.Migrations.Application
{
    public partial class CreateApplicationDB : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Creation",
                columns: table => new
                {
                    CreationID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    WorldRules = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastEditDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Creation", x => x.CreationID);
                });

            migrationBuilder.CreateTable(
                name: "Access",
                columns: table => new
                {
                    AccessID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserID = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreationID = table.Column<int>(type: "int", nullable: false),
                    AccessLevel = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Access", x => x.AccessID);
                    table.ForeignKey(
                        name: "FK_Access_Creation_CreationID",
                        column: x => x.CreationID,
                        principalTable: "Creation",
                        principalColumn: "CreationID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CreationObject",
                columns: table => new
                {
                    CreationObjectID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Json = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreationID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CreationObject", x => x.CreationObjectID);
                    table.ForeignKey(
                        name: "FK_CreationObject_Creation_CreationID",
                        column: x => x.CreationID,
                        principalTable: "Creation",
                        principalColumn: "CreationID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Sequencer",
                columns: table => new
                {
                    SequencerID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Json = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreationID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sequencer", x => x.SequencerID);
                    table.ForeignKey(
                        name: "FK_Sequencer_Creation_CreationID",
                        column: x => x.CreationID,
                        principalTable: "Creation",
                        principalColumn: "CreationID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Access_CreationID",
                table: "Access",
                column: "CreationID");

            migrationBuilder.CreateIndex(
                name: "IX_CreationObject_CreationID",
                table: "CreationObject",
                column: "CreationID");

            migrationBuilder.CreateIndex(
                name: "IX_Sequencer_CreationID",
                table: "Sequencer",
                column: "CreationID",
                unique: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Access");

            migrationBuilder.DropTable(
                name: "CreationObject");

            migrationBuilder.DropTable(
                name: "Sequencer");

            migrationBuilder.DropTable(
                name: "Creation");
        }
    }
}
