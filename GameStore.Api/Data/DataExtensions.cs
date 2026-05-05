using GameStore.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Api.Data;

public static class DataExtensions
{
    public static void MigrateDb(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();

        var dbContext = scope.ServiceProvider.GetRequiredService<GameStoreContext>();

        dbContext.Database.Migrate();
    }

    public static void AddGameStoreDb(this WebApplicationBuilder builder)
    {

        var connString = builder.Configuration.GetConnectionString("GameStore") ?? throw new InvalidOperationException("Connection string 'GameStore' not found.");

        // DbContext has a scoped service lifetime by default:
        // 1) It ensures that a new instance of the DbContext is created for each HTTP request, which is important for handling concurrent requests and avoiding shared state issues.
        // 2) It allows for better performance and resource management, as DB connections are typically expensive to create and maintain, and a scoped lifetime helps to ensure that they are properly disposed of at the end of each request.

        builder.Services.AddSqlite<GameStoreContext>(connString, optionsAction: options =>
        {
            options.UseSeeding((context, _) =>
            {
                if (!context.Set<Genre>().Any())
                {
                    context.Set<Genre>().AddRange(
                        new Genre { Name = "Fighting" },
                        new Genre { Name = "RPG" },
                        new Genre { Name = "Platformer" },
                        new Genre { Name = "Racing" },
                        new Genre { Name = "Sports" }
                    );

                    context.SaveChanges();
                }
            });
        });
    }
}
