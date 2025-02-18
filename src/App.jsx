import { createContext, useState, useEffect } from "react";
import { TodoProvider } from "./components/TodoContext";
import { getPage } from "./helper";
import "./App.css";
import MyComponent from "./components/Header";

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
        <MyComponent/> 
        <div className="page-content">
          {page ? page.component : <h1>Sayfa Bulunamadı</h1>}
        </div>
      </div>
    </TodoProvider>
  );
}

export default App;
