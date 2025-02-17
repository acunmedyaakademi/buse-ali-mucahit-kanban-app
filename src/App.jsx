import { createContext, useState, useEffect } from "react";
import { TodoProvider } from "./components/TodoContext";
import { getPage } from "./helper";
import './App.css'

function App() {
  const [url, setUrl] = useState(location.hash.substring(1) || "/");
  const [activeLink, setActiveLink] = useState(url);
  const PageContext = createContext(null);

  useEffect(() => {
    const updateUrl = () => {
      const newUrl = location.hash.substring(1) || "/";
      setUrl(newUrl);
      setActiveLink(newUrl);
    };

    window.addEventListener("hashchange", updateUrl);
    return () => window.removeEventListener("hashchange", updateUrl);
  }, []);


  const page = getPage(url);

  return (
    <TodoProvider>
      <div className="app-container">
        <div className="page">
          <div className="links">
            <a
              href="#/"
              className="link"
            >
              home
            </a>
            <a
              href="#/new-edit-board"
              className="link"
            >
              New Edit Board
            </a>
            <a
              href="#/new-edit-task"
              className="link"
            >
              New Edit Task
            </a>
          </div>
          <PageContext.Provider value={page}>
            {page.component}
          </PageContext.Provider>
        </div>
      </div>
    </TodoProvider>
  );
}

export default App
