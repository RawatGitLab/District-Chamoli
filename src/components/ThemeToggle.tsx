import React from "react";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  theme: "light" | "dark";
  onToggle: () => void;
  className?: string;
}

export default function ThemeToggle({ theme, onToggle, className = "" }: ThemeToggleProps) {
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`p-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer border select-none flex items-center justify-center ${
        isLight
          ? "bg-slate-100 hover:bg-slate-200 text-amber-600 border-slate-200 shadow-xs"
          : "bg-slate-800 hover:bg-slate-700 text-indigo-300 border-slate-700/80 shadow-xs"
      } ${className}`}
      title={`Switch to ${isLight ? "Dark" : "Light"} Mode`}
      aria-label="Toggle application theme"
    >
      {isLight ? (
        <Sun className="w-4 h-4 text-amber-500 fill-amber-500/20 shrink-0" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-400 fill-indigo-400/20 shrink-0" />
      )}
    </button>
  );
}
