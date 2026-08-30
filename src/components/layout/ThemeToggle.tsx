"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/ui/Icon";

type Theme = "dark" | "light";

const STORAGE_KEY = "rian-mobil-theme";

/**
 * Tombol ganti tema gelap / terang.
 * Tema default adalah gelap (seperti tampilan original).
 * Pilihan pengguna disimpan di localStorage.
 */
export default function ThemeToggle({
  className = "",
}: {
  className?: string;
}) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const current: Theme = stored === "light" ? "light" : "dark";
    setTheme(current);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.classList.toggle("light", next === "light");
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Aktifkan tema terang" : "Aktifkan tema gelap"}
      title={isDark ? "Tema terang" : "Tema gelap"}
      className={`w-10 h-10 flex items-center justify-center rounded-xl text-ink-soft hover:text-brand hover:bg-surface-soft transition-colors cursor-pointer ${className}`}
    >
      {/* Sebelum mounted, tampilkan ikon default agar tidak terjadi hydration mismatch */}
      <Icon name={mounted && !isDark ? "moon" : "sun"} size={18} />
    </button>
  );
}
