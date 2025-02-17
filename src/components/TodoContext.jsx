import { createContext, useState, useEffect } from "react";

export const TodoContext = createContext(null);

export function TodoProvider({ children }) {
  const [todos, setTodos] = useState([]);
  const [isEdit, setEdit] = useState(false);
  const [currentBoard, setCurrentBoard] = useState(null);
  // const [selectedNotes, setSelectedNotes] = useState(() => {
  //   return JSON.parse(localStorage.getItem("archivedNotes")) || [];
  // });

  useEffect(() => {
    async function fetchNotes() {
      const data = await fetch("data/data.json").then((r) => r.json());
      setTodos(data.boards);
      localStorage.setItem("feedbackData", JSON.stringify(data.todos));
    }
    fetchNotes();
  }, []);

  // useEffect(() => {
  //   localStorage.setItem("archivedNotes", JSON.stringify(selectedNotes));
  // }, [selectedNotes]);

  // const addNote = (newNote) => {
  //   setFeedback([...notes, { ...newNote, id: notes.length + 1, date: new Date().toLocaleDateString() }]);
  // };

  return (
    <TodoContext.Provider value={{ todos, setTodos, isEdit, setEdit, currentBoard, setCurrentBoard }}>
      {children}
    </TodoContext.Provider>
  );
}