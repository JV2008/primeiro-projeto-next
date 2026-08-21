"use client";

import { useEffect, useRef, useState } from "react";

type Meteorite = { x: number; y: number; size: number; speed: number };

export default function JogoPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let meteorites: Meteorite[] = [];
    let playerX = 0;
    let keys: Record<string, boolean> = {};
    let points = 0;
    let speedMultiplier = 1;
    let alive = true;
    let playing = true;
    const gameOverRef = { current: false };

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      playerX = canvas.width / 2 - 20;
    };

    resize();
    window.addEventListener("resize", resize);

    const handleKey = (e: KeyboardEvent) => {
      keys[e.key.toLowerCase()] = e.type === "keydown";

      if (e.key === "Enter" || e.key === " ") {
        if (!playing && gameOverRef.current) {
          meteorites = [];
          points = 0;
          speedMultiplier = 1;
          alive = true;
          playing = true;
          gameOverRef.current = false;
          setScore(0);
          setGameOver(false);
          resize();
          playerX = canvas.width / 2 - 20;
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("keyup", handleKey);

    const createMeteorite = () => {
      const size = 18 + Math.random() * 28;
      meteorites.push({
        x: Math.random() * (canvas.width - size),
        y: -size,
        size,
        speed: (2.2 + Math.random() * 2.8) * speedMultiplier,
      });
    };

    const drawPlayer = () => {
      const size = 40;
      const y = canvas.height - 80;

      ctx.save();
      ctx.shadowColor = "#00ffea";
      ctx.shadowBlur = 20;
      ctx.fillStyle = "#00ffea";
      ctx.beginPath();
      ctx.moveTo(playerX + size / 2, y);
      ctx.lineTo(playerX, y + size);
      ctx.lineTo(playerX + size, y + size);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const drawMeteorites = () => {
      for (const m of meteorites) {
        ctx.save();
        ctx.shadowColor = "#ff6b6b";
        ctx.shadowBlur = 14;
        ctx.fillStyle = "#ff6b6b";
        ctx.beginPath();
        ctx.arc(m.x + m.size / 2, m.y + m.size / 2, m.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    };

    const updateMeteorites = () => {
      for (let i = meteorites.length - 1; i >= 0; i--) {
        const m = meteorites[i];
        m.y += m.speed;

        const dx = Math.abs(playerX + 20 - (m.x + m.size / 2));
        const dy = Math.abs(canvas.height - 80 + 20 - (m.y + m.size / 2));
        const collisionDistance = 20 + m.size / 2 - 10;

        if (dx < collisionDistance && dy < collisionDistance) {
          alive = false;
          return;
        }

        if (m.y > canvas.height + m.size) {
          meteorites.splice(i, 1);
          points += 10;
          setScore(points);
          speedMultiplier = 1 + points / 500;
        }
      }
    };

    const updatePlayer = () => {
      const speed = 6;
      if (keys["arrowleft"] || keys["a"]) playerX -= speed;
      if (keys["arrowright"] || keys["d"]) playerX += speed;
      playerX = Math.max(0, Math.min(canvas.width - 40, playerX));
    };

    const drawStars = () => {
      for (let i = 0; i < 60; i++) {
        const x = (Math.sin(i * 132 + points) * 0.5 + 0.5) * canvas.width;
        const y = (Math.cos(i * 87 + points * 0.2) * 0.5 + 0.5) * canvas.height;
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.fillRect(x, y, 1.5, 1.5);
      }
    };

    const drawHud = () => {
      ctx.save();
      ctx.fillStyle = "#00ffea";
      ctx.shadowColor = "#00ffea";
      ctx.shadowBlur = 10;
      ctx.font = "bold 18px monospace";
      ctx.fillText(`PONTOS: ${points}`, 20, 44);
      ctx.restore();
    };

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawStars();

      if (playing) {
        updatePlayer();
        updateMeteorites();

        if (!alive) {
          playing = false;
          gameOverRef.current = true;
          setGameOver(true);
          animationId = requestAnimationFrame(loop);
          return;
        }

        if (Math.random() < 0.025 + speedMultiplier * 0.005) {
          createMeteorite();
        }
      }

      drawMeteorites();
      drawPlayer();
      drawHud();

      animationId = requestAnimationFrame(loop);
    };

    animationId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("keyup", handleKey);
    };
  }, []);

  return (
    <div className="relative flex flex-1 items-center justify-center bg-black">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

      <div className="absolute left-4 top-4 z-20">
        <a
          href="/"
          className="rounded-full border border-white/10 bg-black/80 px-4 py-2 text-xs font-medium text-zinc-300 backdrop-blur transition hover:bg-white/10 hover:text-white"
        >
          ← Voltar
        </a>
      </div>

      {!gameOver && (
        <div className="z-10 flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-black/80 px-8 py-10 text-center backdrop-blur">
          <h1 className="text-3xl font-bold tracking-tight text-[#00ffea]" style={{ textShadow: "0 0 20px #00ffea" }}>
            SPACE DODGER
          </h1>
          <p className="text-sm text-zinc-400">Desvie dos asteroides e sobreviva o máximo que puder.</p>
          <p className="text-xs text-zinc-500">Use ← → ou A D para mover</p>
          <p className="text-xs text-zinc-500">Pressione Enter ou Espaço para iniciar</p>
        </div>
      )}

      {gameOver && (
        <div className="z-10 flex flex-col items-center gap-4 rounded-2xl border border-red-500/40 bg-black/80 px-8 py-10 text-center backdrop-blur">
          <h2 className="text-2xl font-bold text-red-400" style={{ textShadow: "0 0 15px red" }}>
            GAME OVER
          </h2>
          <p className="text-sm text-zinc-300">Sua pontuação: {score}</p>
          <p className="text-xs text-zinc-500">Pressione Enter ou Espaço para tentar novamente</p>
        </div>
      )}
    </div>
  );
}
