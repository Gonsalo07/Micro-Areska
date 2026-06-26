"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useState } from "react";

export const DarkModeSwitch = () => {
  const { setTheme, resolvedTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-8 w-8 shrink-0" aria-hidden />;
  }

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center text-default-500 transition-colors hover:text-foreground"
    >
      {isDark ? (
        <Moon className="h-[18px] w-[18px] text-indigo-400" strokeWidth={1.75} />
      ) : (
        <Sun className="h-[18px] w-[18px] text-amber-500" strokeWidth={1.75} />
      )}
    </button>
  );
};
