import { useEffect, useState } from "react";
import { AddGameForm } from "./components/AddGameForm";
import { GamesTable } from "./components/GamesTable";
import { type Game, type GameDto, type Genre } from "./types";

const App = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loadingGames, setLoadingGames] = useState(true);
  const [loadingGenres, setLoadingGenres] = useState(true);
  const [addingLoading, setAddingLoading] = useState(false);
  const [updatingLoading, setUpdatingLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const getGames = async () => {
    try {
      setLoadingGames(true);
      setErrors({});
      const response = await fetch("/api/games");
      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: ["Failed to fetch games"] });
        }
        return;
      }
      setGames(data);
    } catch (error) {
      console.error("Error fetching games:", error);
      setErrors({ general: ["An unexpected error occurred"] });
    } finally {
      setLoadingGames(false);
    }
  };

  useEffect(() => {
    getGames();
  }, []);

  const getGenres = async () => {
    try {
      setLoadingGenres(true);
      setErrors({});
      const response = await fetch("/api/genres");
      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: ["Failed to fetch genres"] });
        }
        return;
      }
      setGenres(data);
    } catch (error) {
      console.error("Error fetching genres:", error);
      setErrors({ general: ["An unexpected error occurred"] });
    } finally {
      setLoadingGenres(false);
    }
  };

  useEffect(() => {
    getGenres();
  }, []);

  const addGame = async (newGame: GameDto) => {
    try {
      setAddingLoading(true);
      setErrors({});
      const response = await fetch("/api/games", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGame),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: ["Failed to add game"] });
        }
        return false;
      }

      setGames((prevGames) => [...prevGames, data]);
      getGames();
      return true;
    } catch (error) {
      console.error("Error adding game:", error);
      setErrors({ general: ["An unexpected error occurred"] });
      return false;
    } finally {
      setAddingLoading(false);
    }
  };

  const updateGame = async (id: number, updatedGame: Omit<GameDto, "id">) => {
    try {
      setUpdatingLoading(true);

      setErrors({});

      const response = await fetch(`/api/games/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedGame),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: ["Failed to update game"] });
        }
        return false;
      } else {
        setGames((prevGames) =>
          prevGames.map((game) => (game.id === id ? data : game)),
        );

        getGames();

        return true;
      }
    } catch (error) {
      console.error("Error updating game:", error);

      setErrors({ general: ["An unexpected error occurred"] });

      return false;
    } finally {
      setUpdatingLoading(false);
    }
  };

  const deleteGame = async (id: number) => {
    try {
      setDeletingId(id);

      setErrors({});

      const response = await fetch(`/api/games/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: ["Failed to delete game"] });
        }
      } else {
        setGames((prevGames) => prevGames.filter((game) => game.id !== id));
      }
    } catch (error) {
      console.error("Error deleting game:", error);

      setErrors({ general: ["An unexpected error occurred"] });
    } finally {
      setDeletingId(null);
    }
  };
  return (
    <main className="flex flex-col min-h-screen">
      <h1 className="text-3xl font-bold w-full text-center bg-blue-500 text-white py-4 ">
        Game Store React and .NET API
      </h1>

      <AddGameForm
        genres={genres}
        onAddGame={addGame}
        errors={errors}
        loading={addingLoading}
        loadingGenres={loadingGenres}
      />

      <GamesTable
        games={games}
        genres={genres}
        onUpdateGame={updateGame}
        onDeleteGame={deleteGame}
        errors={errors}
        loadingGames={loadingGames}
        updatingLoading={updatingLoading}
        deletingId={deletingId}
      />
    </main>
  );
};

export default App;
