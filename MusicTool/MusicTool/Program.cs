using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using MusicTool.Areas.Identity.Data;
using MusicTool.Data;
var builder = WebApplication.CreateBuilder(args);
var identityConnectionString = builder.Configuration.GetConnectionString("MusicToolIdentityContextConnection");;

builder.Services.AddDbContext<IdentityContext>(options =>
    options.UseSqlServer(identityConnectionString));;

/*builder.Services.AddDefaultIdentity<User>(options => options.SignIn.RequireConfirmedAccount = true)
    .AddEntityFrameworkStores<IdentityContext>();*/

var applicationConnectionString = builder.Configuration.GetConnectionString("MusicToolApplicationContextConnection");


//var dbPassword = builder.Configuration["ApplicationDatabase:Password"];

//var strBuilder = new SqlConnectionStringBuilder(
//        builder.Configuration.GetConnectionString("RemoteMusicToolApplicationContextConnection"));
//strBuilder.Password = dbPassword;

//applicationConnectionString = strBuilder.ConnectionString;



builder.Services.AddDbContext<ApplicationContext>(options =>
    options.UseSqlServer(applicationConnectionString));




// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddControllersWithViews();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseDefaultFiles();
app.UseStaticFiles();

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html"); ;
app.UseAuthentication();;

await CreateDbIfNotExistsAsync(app);


app.Run();

static async Task CreateDbIfNotExistsAsync(WebApplication app)
{
    using (var scope = app.Services.CreateScope())
    {
        var services = scope.ServiceProvider;
        try
        {
            var context = services.GetRequiredService<ApplicationContext>();
    
            await context.Database.EnsureCreatedAsync();
            ApplicationContext.Seed(context);
            
        }
        catch (Exception ex)
        {
            var logger = services.GetRequiredService<ILogger<Program>>();
            logger.LogError(ex, "An error occurred creating the DB.");
        }

        try
        {
            var context = services.GetRequiredService<IdentityContext>();
            await context.Database.EnsureCreatedAsync();
            //context.Users.Add(new User {Email="aaa@gmail.com",Password="1234" });
            //context.SaveChanges(); 
        }
        catch (Exception ex)
        {
            var logger = services.GetRequiredService<ILogger<Program>>();
            logger.LogError(ex, "An error occurred creating the DB.");
        }
    }
        //var context = app.Services.GetRequiredService<ApplicationContext>();
}

//static async Task CreateDbIfNotExistsAsync(IHost host)
//{
//    using (var scope = host.Services.CreateScope())
//    {
//        var services = host.Services;
//        try
//        {
//            var musicToolDB = services.GetRequiredService<MusicToolContext>();

//            //UserManager<MusicToolUser> um = services.GetRequiredService<UserManager<MusicToolUser>>();
//            //RoleManager<IdentityRole> rm = services.GetRequiredService<RoleManager<IdentityRole>>();

//            //await SeedUsersRolesDB.InitializeAsync(rolesDB, um, rm);
//            musicToolDB.Database.EnsureCreated();


//            var TADB = services.GetRequiredService<MusicToolContext>();
//            //TA_DB_Initializer.Initialize(TADB, rolesDB);
//        }
//        catch (Exception ex)
//        {
//            var logger = services.GetRequiredService<ILogger<Program>>();
//            logger.LogError(ex, "An error occurred creating the DB.");
//        }
//    }
//}