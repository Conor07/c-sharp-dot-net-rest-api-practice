namespace GameStore.Api.Dtos;

// A Dto is a contract between the client and the server. It defines the shape of the data that is sent and received by the API.

public record class GameDto(
    int Id,
    string Name,
    string Genre,
    decimal Price,
    DateOnly ReleaseDate
);
