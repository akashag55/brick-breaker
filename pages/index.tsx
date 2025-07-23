import GameButton from "./components/GameButton";
import GameCanvas from "./components/GameCanvas";
import Header from "./components/Header";
import Scoreboard from "./components/Scoreboard";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <Header />
      <Scoreboard />
      <GameCanvas />
      <GameButton />
    </main>
  );
}
