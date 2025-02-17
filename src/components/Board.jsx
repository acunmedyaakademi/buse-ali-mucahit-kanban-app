import { TodoContext } from "./TodoContext";
import { useContext, useState, useEffect } from "react";

export default function Board() {
  const { todos, setTodos, setEdit, setCurrentBoard, dialogRef } =
    useContext(TodoContext);
  const [selectedBoard, setSelectedBoard] = useState(null);
  useEffect(() => {
    console.log("Seçilen Board:", selectedBoard);
  }, [selectedBoard]);

  function handleSelectBoard(board) {
    console.log("Seçilen Board:", board);
    setSelectedBoard({ ...board, columns: board.columns || [] });
    setEdit(false);
    setCurrentBoard(board);

    if (dialogRef.current) {
      dialogRef.current.showModal();
    } else {
      console.error("Dialog referansı bulunamadı!");
    }
  }

  return (
    <div className="boardPage">
      <ul className="allBoards">
        {todos?.map((x) => (
          <li className="board" key={x.id}>
            <button onClick={() => handleSelectBoard(x)}>{x.name}</button>
          </li>
        ))}
      </ul>
      <a
        href="#/new-edit-board"
        onClick={() => {
          setEdit(true);
          setCurrentBoard(selectedBoard);
        }}
      >
        Edit Board
      </a>
      <a href="#/new-edit-board">Create new board</a>
      {selectedBoard && <BoardColumns board={selectedBoard} />}
    </div>
  );
}
function BoardColumns({ board }) {
  if (!board || !Array.isArray(board.columns)) {
    return <p>Bu board için kolon bulunmamaktadır.</p>;
  }

  return (
    <div>
      <div className="boardColumns">
        {board.columns.length > 0 ? (
          board.columns.map((column, columnIndex) => (
            <div className="boardColumn" key={columnIndex}>
              <h3>{column.name}</h3>
              {(Array.isArray(column.tasks) ? column.tasks : []).length > 0 ? (
                column.tasks.map((task, taskIndex) => (
                  <p key={taskIndex}>{task.title}</p>
                ))
              ) : (
                <p>Bu sütunda görev bulunmamaktadır.</p>
              )}
            </div>
          ))
        ) : (
          <p>Bu board için henüz sütun eklenmemiş.</p>
        )}
      </div>
    </div>
  );
}
