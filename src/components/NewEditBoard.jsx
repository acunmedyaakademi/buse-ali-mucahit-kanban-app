import { useContext, useState, useEffect, useRef } from "react";
import { TodoContext } from "./TodoContext";

export default function NewEditBoard({ closeModal }) {
  const { todos, setTodos, isEdit, setEdit, currentBoard, setCurrentBoard } =
    useContext(TodoContext);

  const [columns, setColumns] = useState([]);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isEdit && currentBoard) {
      setColumns(currentBoard.columns || []);
    }
  }, [isEdit, currentBoard]);

  // ➡️ Modal dışına tıklayınca kapanma işlevi
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeModal]);

  const addColumn = () =>
    setColumns([...columns, { id: columns.length, name: "" }]);

  const handleColumnChange = (index, value) => {
    const updatedColumns = [...columns];
    updatedColumns[index].name = value;
    setColumns(updatedColumns);
  };

  const deleteColumn = (id) =>
    setColumns(columns.filter((col) => col.id !== id));

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);

    const newBoard = {
      id: crypto.randomUUID(),
      name: formObj.name,
      columns: columns.length > 0 ? columns : [],
    };

    setTodos((prevTodos) => [...prevTodos, newBoard]);
    closeModal();
  };

  const editBoard = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);

    setTodos(
      todos.map((todo) =>
        todo.id === currentBoard.id
          ? { ...todo, name: formObj.name, columns }
          : todo
      )
    );

    setEdit(false);
    setCurrentBoard(null);
    closeModal();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <h3>{isEdit ? "Edit Board" : "Add New Board"}</h3>
        <form autoComplete="off" onSubmit={isEdit ? editBoard : handleSubmit}>
          <div className="newBoardName">
            <label>Board Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Web Design"
              required
              defaultValue={isEdit ? currentBoard?.name : ""}
            />
          </div>

          <div className="newBoardColumns">
            <label>Board Columns</label>
            {columns.map((column, index) => (
              <div key={column.id} className="column-input">
                <input
                  type="text"
                  value={column.name}
                  onChange={(e) => handleColumnChange(index, e.target.value)}
                  placeholder={`Column ${index + 1}`}
                />
                {columns.length > 1 && (
                  <button type="button" onClick={() => deleteColumn(column.id)}>
                    ❌
                  </button>
                )}
              </div>
            ))}
            <button type="button" className="addNewBtn" onClick={addColumn}>
              + Add New Column
            </button>
            <div className="addNewBoardBtn">
              {isEdit ? (
                <button className="saveBtn">Save Changes</button>
              ) : (
                <button className="createNewBoardBtn">Create New Board</button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
