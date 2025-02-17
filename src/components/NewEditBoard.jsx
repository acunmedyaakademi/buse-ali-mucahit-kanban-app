import { useContext, useState } from "react";
import { TodoContext } from "./TodoContext";

export default function NewEditBoard() {
  const { todos, setTodos, isEdit, setEdit, currentTodo, setCurrentTodo } =
    useContext(TodoContext);

  const [columns, setColumns] = useState([{ id: 0, name: "" }]);

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

  return (
    <div className="newEditBoardPage">
      {!isEdit && (
        <div className="newBoardDialog">
          <form autoComplete="off">
            <div className="newBoardName">
              <label>Name</label>
              <input type="text" name="name" required />
            </div>
            <div className="newBoardColumns">
              <label>Columns</label>
              {columns.map((column, index) => (
                <div key={column.id} className="column-input">
                  <input
                    type="text"
                    name="column"
                    value={column.name}
                    onChange={(e) => handleColumnChange(index, e.target.value)}
                    required
                  />
                  {columns.length > 1 && (
                    <button
                      type="button"
                      onClick={() => deleteColumn(column.id)}
                    >
                      ❌
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={addColumn}>
                + Add New Column
              </button>
            </div>

            <div className="addNewBoardBtns">
              <button>Create New Board</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
