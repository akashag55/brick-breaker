"use client";

import { createContext, useState, ReactNode } from "react";

type GameState = "START" | "PLAYING" | "WIN" | "GAME_OVER";

interface GameContextType {
  gameState: GameState;
  score: number;
  lives: number;
  startGame: () => void;
  restartGame: () => void;
  increaseScore: (points: number) => void;
  loseLife: () => void;
  setGameState: (state: GameState) => void;
}

export const GameContext = createContext<GameContextType>(
  {} as GameContextType
);

export default function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>("START");
  const [score, setScore] = useState<number>(0);
  const [lives, setLives] = useState<number>(3);

  const startGame = () => {
    setGameState("PLAYING");
  };

  const restartGame = () => {
    setScore(0);
    setLives(1);
    setGameState("START");
  };

  const increaseScore = (points: number) => {
    setScore((prev) => prev + points);
  };

  const loseLife = () => {
    setLives((prev) => {
      const newLives = prev - 1;
      if (newLives <= 0) setGameState("GAME_OVER");
      return newLives;
    });
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        score,
        lives,
        startGame,
        restartGame,
        increaseScore,
        loseLife,
        setGameState,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}
