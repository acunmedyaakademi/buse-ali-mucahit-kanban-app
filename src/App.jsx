import { createContext, useState, useEffect } from "react";
import { TodoProvider } from "./components/TodoContext";
import { getPage } from "./helper";
import "./App.css";

function App() {
  const [url, setUrl] = useState(window.location.hash.substring(1) || "/");
  const PageContext = createContext(null);

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
    <TodoProvider>
      <div className="app-container">
        <nav className="nav-links">
          <a href="#/" className={`link ${url === "/" ? "active" : ""}`}>
            Home
          </a>
          <a
            href="#/new-edit-board"
            className={`link ${url === "/new-edit-board" ? "active" : ""}`}
          >
            New Edit Board
          </a>
          <a
            href="#/new-edit-task"
            className={`link ${url === "/new-edit-task" ? "active" : ""}`}
          >
            New Edit Task
          </a>
        </nav>

        <div className="page-content">
          {page ? page.component : <h1>Sayfa Bulunamadı</h1>}
        </div>
      </div>
    </TodoProvider>
  );
}

export default App;
