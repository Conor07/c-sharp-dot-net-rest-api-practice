namespace GameStore.Api.Dtos;

// A Dto is a contract between the client and the server. It defines the shape of the data that is sent and received by the API.

public record class GameDetailsDto(
    int Id,
    string Name,
    int GenreId,
    decimal Price,
    DateOnly ReleaseDate
);
