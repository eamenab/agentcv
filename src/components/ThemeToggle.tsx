
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn(
        "relative rounded-full p-2 transition-transform duration-300 hover:scale-110",
        theme === "light" 
          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white" 
          : "bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900",
        className
      )}
      aria-label="Toggle theme"
    >
      <div className="relative z-10">
        {theme === "light" ? (
          <Moon className="h-5 w-5" />
        ) : (
          <Sun className="h-5 w-5" />
        )}
      </div>
      <div className="absolute inset-0 rounded-full opacity-20 blur-sm bg-white" />
    </button>
  );
}
