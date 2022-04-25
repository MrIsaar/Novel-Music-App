using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using MusicTool.Areas.Application.Data;
using MusicTool.Areas.Identity.Data;

namespace MusicTool.Data;

public class ApplicationContext : DbContext
{
    public DbSet<Creation> Creation { get; set; }
    public DbSet<CreationObject> CreationObject { get; set; }

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

    public static void Seed(ApplicationContext context)
    {
        if (!context.Creation.Any())
        {
            Creation c = new Creation();
            c.CreationDate = DateTime.Now;
            c.LastEditDate = DateTime.Now;
            c.WorldRules = "{\"gravity\": 1, \"background\": \"blue\"}";
            c.Name = "TestCreation";
            context.Creation.Add(c);
            context.SaveChanges();
        }
        int cID = context.Creation.First().CreationID;

        if (!context.CreationObject.Any())
        {
            context.CreationObject.AddRange(
                new CreationObject[]
                {
                    new CreationObject
                    {
                        CreationID = cID,
                        Json = "{\"type\": \"cannon\", \"x\": 0, \"y\": 0, \"radius\": 10, \"color\": \"red\"}",
                        Type = "cannon"
                    },
                    new CreationObject
                    {
                        CreationID = cID,
                        Json = "{\"type\": \"drum\", \"x\": 10, \"y\": 10, \"radius\": 10, \"color\": \"red\"}",
                        Type = "drum"
                    },
                    new CreationObject
                    {
                        CreationID = cID,
                        Json = "{\"type\": \"cymbal\", \"x\": 30, \"y\": 30, \"radius\": 10, \"color\": \"red\"}",
                        Type = "cymbal"
                    },
                });

        }
        if (!context.Sequencer.Any())
        {
            Sequencer s = new Sequencer();
            s.CreationID = cID;
            s.Json = "{\"tracks\": [{\"name\": \"track1\", \"notes\": [true, true, true, false, false, false]}, {\"name\": \"track2\", \"notes\": [true, false, false, false, false, false]}]}";
            context.Sequencer.Add(s);
        }
        if (!context.Access.Any())
        {
            Access a = new Access();
            a.CreationID = cID;
            a.UserID = "1";
            a.AccessLevel = AccessLevel.Owner;
            context.Access.Add(a);
        }
        context.SaveChanges();

    }
}
