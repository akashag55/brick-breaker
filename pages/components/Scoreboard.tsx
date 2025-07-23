// components/Scoreboard.tsx
"use client";
import { useContext } from "react";
import { GameContext } from "../context/GameContext";

export default function Scoreboard() {
  const { score, lives } = useContext(GameContext);
  return (
    <div className="flex gap-8 mb-4">
      <span>Score: {score}</span>
      <span>Lives: {lives}</span>
    </div>
  );
}
