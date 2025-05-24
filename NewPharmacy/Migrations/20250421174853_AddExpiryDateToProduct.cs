﻿using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NewPharmacy.Migrations
{
    /// <inheritdoc />
    public partial class AddExpiryDateToProduct : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ExpiryDate",
                table: "Products",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExpiryDate",
                table: "Products");
        }
    }
}
