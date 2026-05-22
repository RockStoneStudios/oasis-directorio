// src/components/theme-toggle.tsx
"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect asegura que el componente solo se renderice en el cliente,
  // evitando errores de hidratación.
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Devuelve un placeholder para evitar el movimiento del layout (layout shift)
    return <div className="w-9 h-9" />;
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex items-center justify-center rounded-md p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      aria-label="Cambiar tema"
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-yellow-500 transition-all" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700 dark:text-slate-200 transition-all" />
      )}
    </button>
  );
}