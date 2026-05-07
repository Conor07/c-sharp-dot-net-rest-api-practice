import { useGames } from "../contexts/GamesContext";
import { type Game, type Genre } from "../types";

interface EditGameModalProps {
  editingGame: Game | null;
  setEditingGame: (game: Game | null) => void;
  genres: Genre[];
  errors: Record<string, string[]>;
  updatingLoading: boolean;
  onClose: () => void;
  onSubmit: (updatedGame: {
    name: string;
    genreId: number;
    price: number;
    releaseDate: string;
  }) => Promise<void>;
}

export const EditGameModal = ({
  editingGame,
  setEditingGame,
  genres,
  errors,
  updatingLoading,
  onClose,
  onSubmit,
}: EditGameModalProps) => {
  if (editingGame === null) return null;

  const hasFormErrors = Object.keys(errors).some(
    (key) => key !== "general" && key !== "",
  );

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const updatedGame = {
      name: formData.get("name") as string,
      genreId: parseInt(formData.get("genreId") as string),
      price: parseFloat(formData.get("price") as string),
      releaseDate: formData.get("releaseDate") as string,
    };

    await onSubmit(updatedGame);
  };

  return (
    <div
      className="fixed inset-0 bg-gray-500/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleFormSubmit}
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
            htmlFor={`name-${editingGame?.id || ""}`}
            className="block text-sm font-medium mb-1"
          >
            Name
          </label>

          <input
            type="text"
            name="name"
            id={`name-${editingGame?.id || ""}`}
            defaultValue={editingGame?.name}
            className={`w-full border rounded p-2 ${
              errors.Name ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor={`genreId-${editingGame?.id || ""}`}
            className="block text-sm font-medium mb-1"
          >
            Genre
          </label>

          <select
            name="genreId"
            id={`genreId-${editingGame?.id || ""}`}
            defaultValue={
              genres.find((g) => g.name === editingGame?.genre)?.id ?? ""
            }
            className={`w-full border rounded p-2 ${
              errors.GenreId ? "border-red-500" : "border-gray-300"
            }`}
            required
          >
            <option value="0">Select a genre</option>

            {genres.map((genre) => (
              <option key={genre.id} value={genre.id.toString()}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label
            htmlFor={`price-${editingGame?.id || ""}`}
            className="block text-sm font-medium mb-1"
          >
            Price
          </label>

          <input
            type="number"
            step="0.01"
            name="price"
            id={`price-${editingGame?.id || ""}`}
            defaultValue={editingGame?.price}
            className={`w-full border rounded p-2 ${
              errors.Price ? "border-red-500" : "border-gray-300"
            }`}
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor={`releaseDate-${editingGame?.id || ""}`}
            className="block text-sm font-medium mb-1"
          >
            Release Date
          </label>

          <input
            type="date"
            name="releaseDate"
            id={`releaseDate-${editingGame?.id || ""}`}
            defaultValue={
              editingGame
                ? new Date(editingGame.releaseDate).toISOString().split("T")[0]
                : ""
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
          onClick={onClose}
          disabled={updatingLoading}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 disabled:bg-gray-300"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};
