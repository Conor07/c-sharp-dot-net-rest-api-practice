import { useState } from "react";
import { type Genre } from "../types";
import { type GameDto } from "../types";

interface AddGameFormProps {
  genres: Genre[];
  onAddGame: (game: GameDto) => Promise<boolean>;
  errors: Record<string, string[]>;
  loading: boolean;
  loadingGenres: boolean;
}

export const AddGameForm = ({
  genres,
  onAddGame,
  errors,
  loading,
  loadingGenres,
}: AddGameFormProps) => {
  const [addingGame, setAddingGame] = useState(false);

  const hasFormErrors = Object.keys(errors).some(
    (key) => key !== "general" && key !== "",
  );

  return (
    <section className="p-4">
      {addingGame ? (
        <>
          <h2 className="text-2xl">Add Game</h2>

          {hasFormErrors && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
              <h4 className="font-semibold mb-2">Error:</h4>

              {Object.entries(errors)
                .filter(([key]) => key !== "general" && key !== "")
                .map(([field, messages]) => (
                  <div key={field}>
                    <strong>{field}:</strong>

                    <ul className="list-disc list-inside ml-2">
                      {messages.map((message, index) => (
                        <li key={index}>{message}</li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          )}

          <form
            onSubmit={async (e) => {
              e.preventDefault();

              const formData = new FormData(e.currentTarget);

              const newGame = {
                name: formData.get("name") as string,
                genreId: parseInt(formData.get("genreId") as string),
                price: parseFloat(formData.get("price") as string),
                releaseDate: formData.get("releaseDate") as string,
              };

              const success = await onAddGame(newGame);

              if (success) {
                setAddingGame(false);
                e.currentTarget.reset();
              }
            }}
            className="bg-white rounded mb-4"
          >
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Name
              </label>

              <input
                type="text"
                name="name"
                id="name"
                className={`w-full border rounded p-2 ${
                  errors.Name ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="genreId"
                className="block text-sm font-medium mb-1"
              >
                Genre
              </label>

              <select
                name="genreId"
                id="genreId"
                className={`w-full border rounded p-2 ${
                  errors.GenreId ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loadingGenres}
                required
              >
                <option value="">Select a genre</option>

                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="price" className="block text-sm font-medium mb-1">
                Price
              </label>

              <input
                type="number"
                step="0.01"
                name="price"
                id="price"
                className={`w-full border rounded p-2 ${
                  errors.Price ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="releaseDate"
                className="block text-sm font-medium mb-1"
              >
                Release Date
              </label>

              <input
                type="date"
                name="releaseDate"
                id="releaseDate"
                className={`w-full border rounded p-2 ${
                  errors.ReleaseDate ? "border-red-500" : "border-gray-300"
                }`}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 mr-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {loading ? "Adding..." : "Add Game"}
            </button>

            <button
              type="button"
              onClick={() => setAddingGame(false)}
              disabled={loading}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300"
            >
              Cancel
            </button>
          </form>
        </>
      ) : (
        <button
          onClick={() => setAddingGame(true)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Game
        </button>
      )}
    </section>
  );
};
