import { useState, useEffect } from "react";
import { useGames } from "../contexts/GamesContext";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { EditGameModal } from "./EditGameModal";
import { type Game } from "../types";

export const GamesTable = () => {
  const {
    games,
    genres,
    updateGame,
    deleteGame,
    errors,
    loadingGames,
    updatingLoading,
    deletingId,
  } = useGames();

  const [editingGame, setEditingGame] = useState<Game | null>(null);

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
                        onClick={() => setEditingGame(game)}
                        disabled={deletingId === game.id}
                        className="inline-block text-2xl mr-2 hover:opacity-70 disabled:opacity-50"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => deleteGame(game.id)}
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

          {editingGame !== null && (
            <EditGameModal
              editingGame={editingGame}
              setEditingGame={setEditingGame}
              genres={genres}
              errors={errors}
              updatingLoading={updatingLoading}
              onClose={() => {
                setEditingGame(null);
              }}
              onSubmit={async (updatedGame) => {
                const success = await updateGame(editingGame.id, updatedGame);

                if (success) {
                  setEditingGame(null);
                }
              }}
            />
          )}
        </>
      )}
    </section>
  );
};
