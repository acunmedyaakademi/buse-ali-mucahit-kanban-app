import { TodoContext } from "./TodoContext";
import { useContext, useState, useEffect } from "react";

export default function Board() {
  const { todos, setTodos } = useContext(TodoContext);
  const [ selectedBoard, setSelectedBoard ] = useState(null);
  return (
    <div className="boardPage">
      <ul className="allBoards">
        {todos.map((x) => (
          <li className="board" key={x.id}>
            <button onClick={() => setSelectedBoard(x)}>{x.name}</button>
          </li>
        ))}
      </ul>
      <a href="#/new-edit-board">Create new board</a>
      {selectedBoard && <BoardColumns board={selectedBoard} />}
    </div>
  );
}

function BoardColumns({ board }) {
  return (
    <div>
      <div className="boardColumns">
        {board.columns.map((column, columnIndex) => (
          <div className="boardColumn" key={columnIndex}>
            <h3>{column.name}</h3>
            {column.tasks.map((task, taskIndex) => (
              <p key={taskIndex}>{task.title}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
