// components/GameButton.tsx
"use client";
import { useContext } from "react";
import { GameContext } from "../context/GameContext";

export default function GameButton() {
  const { gameState, startGame, restartGame } = useContext(GameContext);
  const label = gameState === "START" ? "Play" : "Restart";
  const action = gameState === "START" ? startGame : restartGame;
  return (
    <button
      onClick={action}
      className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded"
    >
      {label}
    </button>
  );
}
