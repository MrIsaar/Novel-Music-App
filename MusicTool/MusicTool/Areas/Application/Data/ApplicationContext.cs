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
                        Json = "{ \" MTObjType\" : \" Cannon\" , \" MTObjVersion\" : \" 1.0.0\" , \" pos\" : { \" x\" : 200, \" y\" : 100 }, \" angle\" : 0, \" image\" : null, \" shape\" : [ { \" x\" : -20, \" y\" : -20 }, { \" x\" : 40, \" y\" : 0 }, { \" x\" : -20, \" y\" : 20 }, { \" x\" : -30, \" y\" : 0 } ], \" collisionFilter\" : { \" group\" : 0, \" category\" : 0, \" mask\" : 0 }, \" fireLayer\" : 1, \" power\" : 20, \" marbleSize\" : 20, \" marbleColor\" : \" rand\" , \" marbleCollisionFilter\" : { \" group\" : -1, \" category\" : 4294967295, \" mask\" : 4294967295 } }",
                        Type = "Cannon"
                    },
                    new CreationObject
                    {
                        CreationID = cID,
                        Json = "{ \" MTObjType\" : \" Cannon\" , \" MTObjVersion\" : \" 1.0.0\" , \" pos\" : { \" x\" : 200, \" y\" : 200 }, \" angle\" : 0, \" image\" : null, \" shape\" : [ { \" x\" : -20, \" y\" : -20 }, { \" x\" : 40, \" y\" : 0 }, { \" x\" : -20, \" y\" : 20 }, { \" x\" : -30, \" y\" : 0 } ], \" collisionFilter\" : { \" group\" : 0, \" category\" : 0, \" mask\" : 0 }, \" fireLayer\" : 1, \" power\" : 20, \" marbleSize\" : 20, \" marbleColor\" : \" rand\" , \" marbleCollisionFilter\" : { \" group\" : -1, \" category\" : 4294967295, \" mask\" : 4294967295 } }",

                        Type = "Cannon"
                    },
                    new CreationObject
                    {
                        CreationID = cID,
                        Json = "{ \" MTObjType\" : \" Cannon\" , \" MTObjVersion\" : \" 1.0.0\" , \" pos\" : { \" x\" : 200, \" y\" : 300 }, \" angle\" : 0, \" image\" : null, \" shape\" : [ { \" x\" : -20, \" y\" : -20 }, { \" x\" : 40, \" y\" : 0 }, { \" x\" : -20, \" y\" : 20 }, { \" x\" : -30, \" y\" : 0 } ], \" collisionFilter\" : { \" group\" : 0, \" category\" : 0, \" mask\" : 0 }, \" fireLayer\" : 1, \" power\" : 20, \" marbleSize\" : 20, \" marbleColor\" : \" rand\" , \" marbleCollisionFilter\" : { \" group\" : -1, \" category\" : 4294967295, \" mask\" : 4294967295 } }",

                        Type = "Cannon"
                    },
                    new CreationObject
                    {
                        CreationID = cID,
                        Json = "{\"MTObjType\":\"Instrument\",\"MTObjVersion\":\"1.0.0\",\"pos\":{\"x\":400,\"y\":150},\"angle\":0,\"image\":null,\"shape\":[{\"x\":-25,\"y\":-10},{\"x\":25,\"y\":-10},{\"x\":20,\"y\":10},{\"x\":-20,\"y\":10}],\"collisionFilter\":{ \"group\":0,\"category\":0,\"mask\":0},\"sound\":{ \"note\":\"E4\",\"length\":\"8n\"}}",
                        Type="Instrument"
                    },
                    new CreationObject
                    {
                        CreationID = cID,
                        Json = "{\"MTObjType\":\"Instrument\",\"MTObjVersion\":\"1.0.0\",\"pos\":{\"x\":400,\"y\":250},\"angle\":0,\"image\":null,\"shape\":[{\"x\":-25,\"y\":-10},{\"x\":25,\"y\":-10},{\"x\":20,\"y\":10},{\"x\":-20,\"y\":10}],\"collisionFilter\":{ \"group\":0,\"category\":0,\"mask\":0},\"sound\":{ \"note\":\"D4\",\"length\":\"8n\"}}",
                        Type="Instrument"
                    },
                    new CreationObject
                    {
                        CreationID = cID,
                        Json = "{\"MTObjType\":\"Instrument\",\"MTObjVersion\":\"1.0.0\",\"pos\":{\"x\":400,\"y\":350},\"angle\":0,\"image\":null,\"shape\":[{\"x\":-25,\"y\":-10},{\"x\":25,\"y\":-10},{\"x\":20,\"y\":10},{\"x\":-20,\"y\":10}],\"collisionFilter\":{ \"group\":0,\"category\":0,\"mask\":0},\"sound\":{ \"note\":\"C4\",\"length\":\"8n\"}}",
                        Type="Instrument"
                    }


                }
                );

        }
        if (!context.Sequencer.Any())
        {
            Sequencer s = new Sequencer();
            s.CreationID = cID;
            s.Json = "{\"tracks\": [{\"name\": \"Backbeat\", \"id\": 1, \"notes\": [true, false, true, false, true, false, true, false]}, {\"name\": \"Cowbell\", \"id\": 2, \"notes\": [true, true, true, true, true, true, true, true]}]}";
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
