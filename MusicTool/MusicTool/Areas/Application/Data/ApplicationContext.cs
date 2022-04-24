using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MusicTool.Areas.Application.Data;
using MusicTool.Areas.Identity.Data;

namespace MusicTool.Data;

public class ApplicationContext : DbContext
{
    public DbSet<Creation> Creation { get; set; }
    public DbSet<Areas.Application.Data.Object> Object { get; set; }

    public DbSet<Sequencer> Sequencer { get; set; }
    public DbSet<Access> Access { get; set; }

    public ApplicationContext(DbContextOptions<ApplicationContext> options)
    : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        // Customize the ASP.NET Identity model and override the defaults if needed.
        // For example, you can rename the ASP.NET Identity table names and more.
        // Add your customizations after calling base.OnModelCreating(builder);
    }
}
