import { useContext, useState, useEffect } from "react";
import { TodoContext } from "./TodoContext";

export default function NewEditBoard() {
  const {
    todos,
    setTodos,
    isEdit,
    setEdit,
    currentTodo,
    setCurrentTodo,
    currentBoard,
    setCurrentBoard,
    dialogRef,
  } = useContext(TodoContext);
  console.log(currentBoard);
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

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formObj = Object.fromEntries(formData);

    const newBoardObj = {
      id: crypto.randomUUID(),
      name: formObj.name,
      columns: columns.length > 0 ? columns : [],
    };

    console.log("Yeni Board:", newBoardObj);
    setTodos((prevTodos) => [...prevTodos, newBoardObj]);
  }

  function editBoard(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    const formObj = Object.fromEntries(form);
    setTodos(
      todos.map((todo) =>
        todo.id === currentBoard.id
          ? { ...todo, ...formObj, columns: currentBoard.columns || [] }
          : todo
      )
    );

    setCurrentBoard(2);
  }

  useEffect(() => {
    console.log("Güncellenmiş Current Board:", currentBoard);
  }, [currentBoard]);

  return (
    <div className="newEditBoardPage">
      <div className="newBoardDialog">
        <dialog ref={dialogRef}>
          <form autoComplete="off" onSubmit={isEdit ? editBoard : handleSubmit}>
            <div className="newBoardName">
              <label>Name</label>
              <input
                type="text"
                name="name"
                required
                defaultValue={currentBoard?.name || ""}
                onChange={(e) =>
                  setCurrentBoard({ ...currentBoard, name: e.target.value })
                }
              />
            </div>
            <div className="newBoardColumns">
              <label>Columns</label>
              {columns.map((column, index) => (
                <div key={column.id} className="column-input">
                  <input
                    type="text"
                    name="column"
                    defaultValue={currentBoard?.columns?.[index]?.name || ""}
                    onChange={(e) => {
                      const updatedColumns = [...(currentBoard?.columns || [])];
                      updatedColumns[index] = {
                        ...updatedColumns[index],
                        name: e.target.value,
                      };
                      setCurrentBoard({
                        ...currentBoard,
                        columns: updatedColumns,
                      });
                    }}
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

            <div className="addNewBoardBtn">
              {isEdit ? (
                <button>Save Changes</button>
              ) : (
                <button>Create New Board</button>
              )}
            </div>
          </form>
        </dialog>
      </div>
    </div>
  );
}
