import { useContext, useState, useEffect } from "react";
import { TodoContext } from "./TodoContext";

export default function NewEditBoard() {
  const {
    todos,
    setTodos,
    isEdit,
    setEdit,
    currentBoard,
    setCurrentBoard
  } = useContext(TodoContext);

  const [columns, setColumns] = useState([{ id: 0, name: "" }]);

  useEffect(() => {
    if (isEdit && currentBoard) {
      setColumns(currentBoard.columns || []);
    }
  }, [isEdit, currentBoard]);

  function addColumn() {
    setColumns([...columns, { id: columns.length, name: "" }]);
  }

  function handleColumnChange(index, value) {
    const newColumns = [...columns];
    newColumns[index].name = value;
    setColumns(newColumns);
  }

  function deleteColumn(id) {
    setColumns(columns.filter((x) => x.id !== id));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);

    const newBoardObj = {
      id: crypto.randomUUID(),
      name: formObj.name,
      columns: columns.length > 0 ? columns : [],
    };

    setTodos((prevTodos) => [...prevTodos, newBoardObj]);
    window.location.hash = "#/";
  }

  function editBoard(e) {
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
    window.location.hash = "#/"; 
  }

  return (
    <div className="newEditBoardPage">
      <form autoComplete="off" onSubmit={isEdit ? editBoard : handleSubmit}>
        <div className="newBoardName">
          <label>Name</label>
          <input
            type="text"
            name="name"
            required
            defaultValue={isEdit ? currentBoard?.name : ""}
          />
        </div>
        <div className="newBoardColumns">
          <label>Columns</label>
          {columns.map((column, index) => (
            <div key={column.id} className="column-input">
              <input
                type="text"
                value={column.name}
                onChange={(e) => handleColumnChange(index, e.target.value)}
                required
              />
              {columns.length > 1 && (
                <button type="button" onClick={() => deleteColumn(column.id)}>
                  ❌
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addColumn}>
            + Add New Column
          </button>
        </div>
        <div className="addNewBoardBtn">
          {isEdit ? <button>Save Changes</button> : <button>Create New Board</button>}
        </div>
      </form>
    </div>
  );
}
