import { AddGameForm } from "./components/AddGameForm";
import { GamesTable } from "./components/GamesTable";
import { GamesProvider } from "./contexts/GamesContext";

const App = () => {
  return (
    <GamesProvider>
      <main className="flex flex-col min-h-screen">
        <h1 className="text-3xl font-bold w-full text-center bg-blue-500 text-white py-4 ">
          Game Store React and .NET API
        </h1>

        <AddGameForm />
        <GamesTable />
      </main>
    </GamesProvider>
  );
};

export default App;
