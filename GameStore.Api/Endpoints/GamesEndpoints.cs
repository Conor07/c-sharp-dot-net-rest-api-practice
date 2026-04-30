using GameStore.Api.Dtos;

namespace GameStore.Api.Endpoints;

public static class GamesEndpoints
{
    const string GetAllGamesEndpointName = "GetAllGames";
    const string GetGameByIdEndpointName = "GetGameById";
    const string CreateGameEndpointName = "CreateGame";
    const string UpdateGameEndpointName = "UpdateGame";
    const string DeleteGameEndpointName = "DeleteGame";
    private static readonly List<GameDto> games = [
        new GameDto(1, "Red Dead Redemption 2", "Action-Adventure", 59.99m, new DateOnly(2018, 10, 26)),
        new GameDto(2, "The Witcher 3: Wild Hunt", "RPG", 39.99m, new DateOnly(2015, 5, 19)),
        new GameDto(3, "The Legend of Zelda: Breath of the Wild", "Action-Adventure", 59.99m, new DateOnly(2017, 3, 3)),
        new GameDto(4, "Super Mario Odyssey", "Platformer", 59.99m, new DateOnly(2017, 10, 27)),
        new GameDto(5, "Minecraft", "Sandbox", 26.95m, new DateOnly(2011, 11, 18))
    ];

    public static void MapGamesEndpoints(this WebApplication app)
    {
        var group = app.MapGroup("/games");

        // GET /games
        group.MapGet("/", () => games).WithName(GetAllGamesEndpointName);

        // GET /games/{id}
        group.MapGet("/{id}", (int id) =>
        {
            var game = games.Find(g => g.Id == id);

            return game is null ? Results.NotFound() : Results.Ok(game);

        }).WithName(GetGameByIdEndpointName);

        // POST /games
        group.MapPost("/", (CreateGameDto newGame) =>
        {
            var game = new GameDto(
                Id: games.Count + 1,
                Name: newGame.Name,
                Genre: newGame.Genre,
                Price: newGame.Price,
                ReleaseDate: newGame.ReleaseDate
            );

            games.Add(game);

            return Results.CreatedAtRoute(GetGameByIdEndpointName, new { id = game.Id }, game);
        }).WithName(CreateGameEndpointName);

        // PUT /games/{id}
        group.MapPut("/{id}", (int id, UpdateGameDto updatedGame) =>
        {

            var index = games.FindIndex(g => g.Id == id);

            if (index == -1)
            {
                return Results.NotFound();
            }

            games[index] = new GameDto(
                Id: id,
                Name: updatedGame.Name,
                Genre: updatedGame.Genre,
                Price: updatedGame.Price,
                ReleaseDate: updatedGame.ReleaseDate
            );

            return Results.NoContent();
        }).WithName(UpdateGameEndpointName);

        // DELETE /games/{id}
        group.MapDelete("/{id}", (int id) =>
        {
            var index = games.FindIndex(g => g.Id == id);

            if (index == -1)
            {
                return Results.NotFound();
            }

            games.RemoveAt(index);

            return Results.NoContent();
        }).WithName(DeleteGameEndpointName);
    }

}
