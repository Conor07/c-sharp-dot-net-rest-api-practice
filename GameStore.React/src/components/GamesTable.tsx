import { useState } from "react";
import { type Game, type Genre } from "../types";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

interface GamesTableProps {
  games: Game[];
  genres: Genre[];
  onUpdateGame: (
    id: number,
    game: Omit<Game, "id" | "genre">,
  ) => Promise<boolean>;
  onDeleteGame: (id: number) => void;
  errors: Record<string, string[]>;
  loadingGames: boolean;
  updatingLoading: boolean;
  deletingId: number | null;
}

export const GamesTable = ({
  games,
  genres,
  onUpdateGame,
  onDeleteGame,
  errors,
  loadingGames,
  updatingLoading,
  deletingId,
}: GamesTableProps) => {
  const [editingGameId, setEditingGameId] = useState<number | null>(null);

  const hasFormErrors = Object.keys(errors).some(
    (key) => key !== "general" && key !== "",
  );

  return (
    <section className="p-4">
      <h2 className="text-2xl">Games</h2>

      {loadingGames ? (
        <p>Loading games...</p>
      ) : games.length === 0 ? (
        <p>No games found.</p>
      ) : (
        <>
          <table className="w-full border-collapse border border-gray-300 bg-white rounded">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-3 text-left">Name</th>

                <th className="border border-gray-300 p-3 text-left">Genre</th>

                <th className="border border-gray-300 p-3 text-left">Price</th>

                <th className="border border-gray-300 p-3 text-left">
                  Release Date
                </th>

                <th className="border border-gray-300 p-3 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => {
                return (
                  <tr key={game.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3">{game.name}</td>

                    <td className="border border-gray-300 p-3">{game.genre}</td>

                    <td className="border border-gray-300 p-3">
                      ${game.price.toFixed(2)}
                    </td>

                    <td className="border border-gray-300 p-3">
                      {new Date(game.releaseDate).toLocaleDateString()}
                    </td>

                    <td className="border border-gray-300 p-3 text-center">
                      <button
                        onClick={() => setEditingGameId(game.id)}
                        disabled={deletingId === game.id}
                        className="inline-block text-2xl mr-2 hover:opacity-70 disabled:opacity-50"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => onDeleteGame(game.id)}
                        disabled={deletingId !== null}
                        className="inline-block text-2xl hover:opacity-70 disabled:opacity-50"
                        title="Delete"
                      >
                        {deletingId === game.id ? "..." : <FaTrashAlt />}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {editingGameId !== null && (
            <div
              className="fixed inset-0 bg-gray-500/50 flex items-center justify-center p-4 z-50"
              onClick={() => setEditingGameId(null)}
            >
              <form
                onClick={(e) => e.stopPropagation()}
                onSubmit={async (e) => {
                  e.preventDefault();

                  const formData = new FormData(e.currentTarget);

                  const updatedGame = {
                    name: formData.get("name") as string,
                    genreId: parseInt(formData.get("genreId") as string),
                    price: parseFloat(formData.get("price") as string),
                    releaseDate: formData.get("releaseDate") as string,
                  };

                  const success = await onUpdateGame(
                    editingGameId,
                    updatedGame,
                  );

                  if (success) {
                    setEditingGameId(null);
                  }
                }}
                className="bg-white rounded p-6 max-w-md w-full shadow-lg max-h-[90vh] overflow-y-auto"
              >
                <h3 className="text-xl font-semibold mb-4">Edit Game</h3>

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

                <div className="mb-4">
                  <label
                    htmlFor={`name-${editingGameId}`}
                    className="block text-sm font-medium mb-1"
                  >
                    Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    id={`name-${editingGameId}`}
                    defaultValue={
                      games.find((g) => g.id === editingGameId)?.name
                    }
                    className={`w-full border rounded p-2 ${
                      errors.Name ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor={`genreId-${editingGameId}`}
                    className="block text-sm font-medium mb-1"
                  >
                    Genre
                  </label>

                  <select
                    name="genreId"
                    id={`genreId-${editingGameId}`}
                    defaultValue={
                      games.find((g) => g.id === editingGameId)?.genreId || ""
                    }
                    className={`w-full border rounded p-2 ${
                      errors.GenreId ? "border-red-500" : "border-gray-300"
                    }`}
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
                  <label
                    htmlFor={`price-${editingGameId}`}
                    className="block text-sm font-medium mb-1"
                  >
                    Price
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    id={`price-${editingGameId}`}
                    defaultValue={
                      games.find((g) => g.id === editingGameId)?.price
                    }
                    className={`w-full border rounded p-2 ${
                      errors.Price ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor={`releaseDate-${editingGameId}`}
                    className="block text-sm font-medium mb-1"
                  >
                    Release Date
                  </label>

                  <input
                    type="date"
                    name="releaseDate"
                    id={`releaseDate-${editingGameId}`}
                    defaultValue={
                      new Date(
                        games.find((g) => g.id === editingGameId)
                          ?.releaseDate || "",
                      )
                        .toISOString()
                        .split("T")[0]
                    }
                    className={`w-full border rounded p-2 ${
                      errors.ReleaseDate ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={updatingLoading}
                  className="bg-green-500 text-white px-4 py-2 mr-2 rounded hover:bg-green-600 disabled:bg-green-300"
                >
                  {updatingLoading ? "Updating..." : "Update Game"}
                </button>

                <button
                  type="button"
                  onClick={() => setEditingGameId(null)}
                  disabled={updatingLoading}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300"
                >
                  Cancel
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </section>
  );
};
