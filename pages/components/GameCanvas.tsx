/* eslint-disable @typescript-eslint/no-explicit-any */
// components/GameCanvas.tsx
"use client";

import { useRef, useEffect, useContext } from "react";
import { GameContext } from "../context/GameContext";

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { gameState } = useContext(GameContext);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx: any = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    let animationFrameId: number;
    let paddle = {
      x: width / 2 - 50,
      y: height - 20,
      width: 100,
      height: 10,
      speed: 8,
    };
    let ball = {
      x: paddle.x + paddle.width / 2,
      y: paddle.y - 8, // place ball above paddle
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
    }

    function update() {
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Wall collision
      if (ball.x + ball.radius > width || ball.x - ball.radius < 0)
        ball.dx *= -1;
      if (ball.y - ball.radius < 0) ball.dy *= -1;
      if (ball.y + ball.radius > height) {
        cancelAnimationFrame(animationFrameId);
      }
    }

    function loop() {
      draw();
      update();
      animationFrameId = requestAnimationFrame(loop);
    }

    // Always draw initial frame on mount
    draw();

    if (gameState === "PLAYING") {
      loop();
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [gameState]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="bg-black border-2 border-white"
    />
  );
}
