import Adsense from "./components/AddSense";
import GameButton from "./components/GameButton";
import GameCanvas from "./components/GameCanvas";
import Header from "./components/Header";
import Scoreboard from "./components/Scoreboard";

export default function Home() {
  return (
    <main className="flex min-h-screen bg-gray-900 text-white">
      {/* Left Ad */}
      <div className="hidden md:flex w-1/6 items-center justify-center">
        <Adsense slot="1111111111" format="vertical" />
      </div>

      {/* Game Content */}
      <div className="flex flex-col items-center justify-center flex-1 p-4">
        <Header />
        <Scoreboard />
        <GameCanvas />
        <GameButton />
      </div>

      {/* Right Ad */}
      <div className="hidden md:flex w-1/6 items-center justify-center">
        <Adsense slot="2222222222" format="vertical" />
      </div>
    </main>
  );
}
