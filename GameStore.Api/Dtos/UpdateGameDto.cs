using System.ComponentModel.DataAnnotations;

namespace GameStore.Api.Dtos;

public record UpdateGameDto(
    [Required][StringLength(50, ErrorMessage = "Name cannot be longer than 50 characters.")]
    string Name,
    [Required][StringLength(20, ErrorMessage = "Genre cannot be longer than 20 characters.")]
    string Genre,
    [Range(1, 100, ErrorMessage = "Price must be between 1 and 100.")]
    decimal Price,
    DateOnly ReleaseDate
);