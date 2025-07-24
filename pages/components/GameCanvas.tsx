/* eslint-disable @typescript-eslint/no-explicit-any */
// components/GameCanvas.tsx
"use client";

import { useRef, useEffect, useContext } from "react";
import { GameContext } from "../context/GameContext";
import { Brick, brickSettings, createBricks } from "../utils/bricks";

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { gameState, loseLife, setGameState } = useContext(GameContext);

  const bricksRef = useRef<Brick[][]>(createBricks());
  const bricks = bricksRef.current;

  useEffect(() => {
    if (gameState === "START") {
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
      speed: 16,
    };
    const keys: Record<string, boolean> = {};

    const ball = {
      x: paddle.x + paddle.width / 2,
      y: paddle.y - 8,
      radius: 8,
      dx: 4,
      dy: -4,
    };

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // Ball
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.closePath();

      // Paddle
      ctx.fillStyle = "white";
      ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

      //draw bricks
      for (let c = 0; c < brickSettings.columnCount; c++) {
        for (let r = 0; r < brickSettings.rowCount; r++) {
          if (bricks[c][r].status === 1) {
            const b = bricks[c][r];
            ctx.fillStyle = "orange";
            ctx.fillRect(b.x, b.y, brickSettings.width, brickSettings.height);
          }
        }
      }
    }

    function update() {
      // Keyboard control
      if (keys["ArrowLeft"] && paddle.x > 0) {
        paddle.x -= paddle.speed;
      }
      if (keys["ArrowRight"] && paddle.x + paddle.width < width) {
        paddle.x += paddle.speed;
      }

      // Ball movement
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Wall collisions
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

      // Missed ball
      if (ball.y + ball.radius > height) {
        loseLife();
        setGameState("START");
        cancelAnimationFrame(animationFrameId);
      }

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
              // TODO: add scoring logic here
            }
          }
        }
      }
    }

    function loop() {
      draw();
      update();
      animationFrameId = requestAnimationFrame(loop);
    }

    // Initial draw
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
  }, [bricks, gameState, loseLife, setGameState]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="bg-black border-2 border-white"
    />
  );
}
