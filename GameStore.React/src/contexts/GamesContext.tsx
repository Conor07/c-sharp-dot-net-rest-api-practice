import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { type Game, type GameDto, type Genre } from "../types";

interface GamesContextType {
  games: Game[];
  genres: Genre[];
  errors: Record<string, string[]>;
  loadingGames: boolean;
  loadingGenres: boolean;
  addingLoading: boolean;
  updatingLoading: boolean;
  deletingId: number | null;
  getGames: () => Promise<void>;
  getGenres: () => Promise<void>;
  addGame: (newGame: GameDto) => Promise<boolean>;
  updateGame: (
    id: number,
    updatedGame: Omit<GameDto, "id">,
  ) => Promise<boolean>;
  deleteGame: (id: number) => Promise<void>;
}

const GamesContext = createContext<GamesContextType | undefined>(undefined);

export const GamesProvider = ({ children }: { children: ReactNode }) => {
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

      if (response.status !== 204) {
        setErrors({ general: ["Failed to update game"] });
        return false;
      }

      const newGame: Game = {
        id,
        ...updatedGame,
        genre:
          genres.find((g) => g.id === updatedGame.genreId)?.name || "Unknown",
      };

      setGames((prevGames) =>
        prevGames.map((game) => (game.id === id ? newGame : game)),
      );

      await getGames();

      return true;
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

  const value: GamesContextType = {
    games,
    genres,
    errors,
    loadingGames,
    loadingGenres,
    addingLoading,
    updatingLoading,
    deletingId,
    getGames,
    getGenres,
    addGame,
    updateGame,
    deleteGame,
  };

  return (
    <GamesContext.Provider value={value}>{children}</GamesContext.Provider>
  );
};

export const useGames = () => {
  const context = useContext(GamesContext);
  if (context === undefined) {
    throw new Error("useGames must be used within a GamesProvider");
  }
  return context;
};
