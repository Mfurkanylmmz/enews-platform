"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const isDark = isClient && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="fixed bottom-6 right-6 z-50 inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-300 bg-white text-zinc-700 shadow-md transition hover:scale-105 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
      aria-label="Tema değiştir"
      title={isDark ? "Açık moda geç" : "Koyu moda geç"}
      suppressHydrationWarning
    >
      {isDark ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5"
          aria-hidden
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2.2M12 19.8V22M4.93 4.93l1.56 1.56M17.5 17.5l1.57 1.57M2 12h2.2M19.8 12H22M4.93 19.07l1.56-1.56M17.5 6.5l1.57-1.57" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5"
          aria-hidden
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79z" />
        </svg>
      )}
    </button>
  );
}
