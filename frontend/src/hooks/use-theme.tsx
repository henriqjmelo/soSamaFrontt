import { createContext, useContext, useEffect, useState } from "react";

type themeProps = "light" | "dark";

interface ThemeContextProps {
  theme: themeProps;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<themeProps>("light");

  function toggleTheme() {
    if (theme === "dark") {
      setTheme("light");
      localStorage.setItem("@psiqueapp:theme", "light");
    } else {
      setTheme("dark");
      localStorage.setItem("@psiqueapp:theme", "dark");
    }
  }

  useEffect(() => {
    const storedTheme = localStorage.getItem("@psiqueapp:theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme);
    } else {
      localStorage.setItem("@psiqueapp:theme", "light");
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme === "dark" ? "dark" : ""}>{children}</div>
    </ThemeContext.Provider>
  );
}
function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

export { ThemeProvider, useTheme };
