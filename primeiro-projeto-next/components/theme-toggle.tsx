"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    } else if (stored === "light") {
      setDark(false);
      document.documentElement.classList.remove("dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Alternar tema"
      className="fixed right-4 top-4 z-50 flex h-9 w-9 items-center justify-center rounded-full border border-black/[.08] bg-white/80 text-sm backdrop-blur transition hover:bg-black/[.04] dark:border-white/[.145] dark:bg-black/80 dark:hover:bg-white/[.06]"
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}
