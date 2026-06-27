import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
  notifications: boolean;
  setNotifications: (v: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem("pms-theme") as Theme | null;
    if (stored) return stored;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  const [notifications, setNotificationsState] = useState<boolean>(
    () => localStorage.getItem("pms-notifications") !== "false",
  );

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem("pms-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("pms-notifications", String(notifications));
  }, [notifications]);

  const setTheme = (t: Theme) => setThemeState(t);
  const toggleTheme = () => setThemeState((p) => (p === "dark" ? "light" : "dark"));
  const setNotifications = (v: boolean) => setNotificationsState(v);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme, notifications, setNotifications }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
