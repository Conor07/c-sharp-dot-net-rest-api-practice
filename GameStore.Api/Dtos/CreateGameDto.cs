using System.ComponentModel.DataAnnotations;

namespace GameStore.Api.Dtos;

public record CreateGameDto(
    [Required][StringLength(50, ErrorMessage = "Name cannot be longer than 50 characters.")]
    string Name,
    [Required][Range(1, 100, ErrorMessage = "GenreId must be between 1 and 100.")]
    int GenreId,
    [Range(1, 100, ErrorMessage = "Price must be between 1 and 100.")]
    decimal Price,
    DateOnly ReleaseDate
);
