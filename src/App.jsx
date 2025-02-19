import { createContext, useState, useEffect } from "react";
import { TodoProvider } from "./components/TodoContext";
import { getPage } from "./helper";
import "./App.css";
import MyComponent from "./components/Header";
import { ThemeProvider, useTheme } from "./components/ThemeContext";

function AppContent() {
  const [url, setUrl] = useState(window.location.hash.substring(1) || "/");
  const { darkMode } = useTheme();

  useEffect(() => {
    const updateUrl = () => {
      const newUrl = window.location.hash.substring(1) || "/";
      setUrl(newUrl);
    };
    window.addEventListener("hashchange", updateUrl);
    return () => window.removeEventListener("hashchange", updateUrl);
  }, []);

  const page = getPage(url);

  return (
    <div className={`board-container ${darkMode ? "dark" : "light"}`}>
      <TodoProvider>
        <div className="app-container">
          <MyComponent />
          <div className="page-content">
            {page ? page.component : <h1>Sayfa Bulunamadı</h1>}
          </div>
        </div>
      </TodoProvider>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
