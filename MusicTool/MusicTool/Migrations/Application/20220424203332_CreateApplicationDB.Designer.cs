﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using MusicTool.Data;

#nullable disable

namespace MusicTool.Migrations.Application
{
    [DbContext(typeof(ApplicationContext))]
    [Migration("20220424203332_CreateApplicationDB")]
    partial class CreateApplicationDB
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.4")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("MusicTool.Areas.Application.Data.Access", b =>
                {
                    b.Property<int>("AccessID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("AccessID"), 1L, 1);

                    b.Property<int>("AccessLevel")
                        .HasColumnType("int");

                    b.Property<int>("CreationID")
                        .HasColumnType("int");

                    b.Property<string>("UserID")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("AccessID");

                    b.HasIndex("CreationID");

                    b.ToTable("Access");
                });

            modelBuilder.Entity("MusicTool.Areas.Application.Data.Creation", b =>
                {
                    b.Property<int>("CreationID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CreationID"), 1L, 1);

                    b.Property<DateTime>("CreationDate")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("LastEditDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("WorldRules")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("CreationID");

                    b.ToTable("Creation");
                });

            modelBuilder.Entity("MusicTool.Areas.Application.Data.Object", b =>
                {
                    b.Property<int>("ObjectID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ObjectID"), 1L, 1);

                    b.Property<int>("CreationID")
                        .HasColumnType("int");

                    b.Property<string>("Json")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("ObjectID");

                    b.HasIndex("CreationID");

                    b.ToTable("Object");
                });

            modelBuilder.Entity("MusicTool.Areas.Application.Data.Sequencer", b =>
                {
                    b.Property<int>("SequencerID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("SequencerID"), 1L, 1);

                    b.Property<int>("CreationID")
                        .HasColumnType("int");

                    b.Property<string>("Json")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("SequencerID");

                    b.HasIndex("CreationID");

                    b.ToTable("Sequencer");
                });

            modelBuilder.Entity("MusicTool.Areas.Application.Data.Access", b =>
                {
                    b.HasOne("MusicTool.Areas.Application.Data.Creation", "Creation")
                        .WithMany()
                        .HasForeignKey("CreationID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Creation");
                });

            modelBuilder.Entity("MusicTool.Areas.Application.Data.Object", b =>
                {
                    b.HasOne("MusicTool.Areas.Application.Data.Creation", "Creation")
                        .WithMany("Object")
                        .HasForeignKey("CreationID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Creation");
                });

            modelBuilder.Entity("MusicTool.Areas.Application.Data.Sequencer", b =>
                {
                    b.HasOne("MusicTool.Areas.Application.Data.Creation", "Creation")
                        .WithMany()
                        .HasForeignKey("CreationID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Creation");
                });

            modelBuilder.Entity("MusicTool.Areas.Application.Data.Creation", b =>
                {
                    b.Navigation("Object");
                });
#pragma warning restore 612, 618
        }
    }
}
