export type Game = {
  id: number;
  name: string;
  genreId: number;
  genre: string;
  price: number;
  releaseDate: string;
};

export type GameDto = Omit<Game, "id" | "genre">;

export type Genre = {
  id: number;
  name: string;
};
