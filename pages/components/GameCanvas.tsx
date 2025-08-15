/* eslint-disable @typescript-eslint/no-explicit-any */
// components/GameCanvas.tsx
"use client";

import { useRef, useEffect, useContext } from "react";
import { GameContext } from "../context/GameContext";
import createBricks, { Brick, brickSettings } from "../utils/bricks";

export default function GameCanvas() {
  1;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { gameState, loseLife, setGameState, increaseScore } =
    useContext(GameContext);

  const bricksRef = useRef<Brick[][]>(createBricks());
  //   const bricks = bricksRef.current;
  const ballRef = useRef({
    x: 0,
    y: 0,
    radius: 8,
    dx: 4,
    dy: -4,
  });

  useEffect(() => {
    if (
      gameState === "START" &&
      bricksRef.current.every((col) => col.every((b) => b.status === 0))
    ) {
      bricksRef.current = createBricks();
    }
  }, [gameState]);

  useEffect(() => {
    const canvas: any = canvasRef.current;
    if (!canvas) return;
    const ctx: any = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    let animationFrameId: number;
    const paddle = {
      x: width / 2 - 50,
      y: height - 20,
      width: 100,
      height: 10,
      speed: 8,
    };
    const keys: Record<string, boolean> = {};

    const bricks = bricksRef.current;
    const ball = ballRef.current;
    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Bricks
      for (let c = 0; c < brickSettings.columnCount; c++) {
        for (let r = 0; r < brickSettings.rowCount; r++) {
          const b = bricks[c][r];
          if (b.status === 1) {
            ctx.fillStyle = "orange";
            ctx.fillRect(b.x, b.y, brickSettings.width, brickSettings.height);
          }
        }
      }

      // Ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.closePath();

      // Paddle
      ctx.fillStyle = "white";
      ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    }

    function update() {
      if (keys["ArrowLeft"] && paddle.x > 0) paddle.x -= paddle.speed;
      if (keys["ArrowRight"] && paddle.x + paddle.width < width)
        paddle.x += paddle.speed;

      ball.x += ball.dx;
      ball.y += ball.dy;

      if (ball.x + ball.radius > width || ball.x - ball.radius < 0)
        ball.dx *= -1;
      if (ball.y - ball.radius < 0) ball.dy *= -1;

      // Paddle collision
      if (
        ball.y + ball.radius >= paddle.y &&
        ball.x >= paddle.x &&
        ball.x <= paddle.x + paddle.width
      ) {
        ball.dy *= -1;
        ball.y = paddle.y - ball.radius;
      }

      // Brick collision
      for (let c = 0; c < brickSettings.columnCount; c++) {
        for (let r = 0; r < brickSettings.rowCount; r++) {
          const b = bricks[c][r];
          if (b.status === 1) {
            if (
              ball.x > b.x &&
              ball.x < b.x + brickSettings.width &&
              ball.y > b.y &&
              ball.y < b.y + brickSettings.height
            ) {
              ball.dy *= -1;
              b.status = 0;
              increaseScore(10);
            }
          }
        }
      }

      // Win check
      const allBricksCleared = bricks.every((col) =>
        col.every((b) => b.status === 0)
      );
      if (allBricksCleared) {
        setGameState("WIN");
        cancelAnimationFrame(animationFrameId);
      }

      // Missed ball
      if (ball.y + ball.radius > height) {
        loseLife();
        setGameState("START");
        cancelAnimationFrame(animationFrameId);
      }
    }

    function loop() {
      draw();
      update();
      animationFrameId = requestAnimationFrame(loop);
    }

    // Initialize ball position relative to paddle
    if (gameState === "START") {
      ball.x = paddle.x + paddle.width / 2;
      ball.y = paddle.y - ball.radius;
    }

    draw();
    if (gameState === "PLAYING") loop();

    function handleKeyDown(e: KeyboardEvent) {
      keys[e.key] = true;
    }
    function handleKeyUp(e: KeyboardEvent) {
      keys[e.key] = false;
    }
    function handleMouseMove(e: MouseEvent) {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      paddle.x = Math.min(
        Math.max(mouseX - paddle.width / 2, 0),
        width - paddle.width
      );
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [gameState, loseLife, setGameState, increaseScore]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="bg-black border-2 border-white"
    />
  );
}
