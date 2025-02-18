import { TodoContext } from "./TodoContext";
import { useContext, useState, useEffect } from "react";
import NewEditBoard from "./NewEditBoard";
import AddColumnModal from "./AddColumnModal"; 
import ViewTask from "./ViewTask";

export default function Board() {
  const { todos, setTodos, setEdit, setCurrentBoard } = useContext(TodoContext);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false); 

  useEffect(() => {
    if (todos.length > 0 && !selectedBoard) {
      handleSelectBoard(todos[0]);
    }
  }, [todos]);

  function handleSelectBoard(board) {
    setSelectedBoard({ ...board, columns: board.columns || [] });
    setEdit(false);
    setCurrentBoard(board);
  }

  function openModal(isEditMode) {
    setEdit(isEditMode);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEdit(false);
    setCurrentBoard(null);
  }

  function openColumnModal() {
    setIsColumnModalOpen(true);
  }

  function closeColumnModal() {
    setIsColumnModalOpen(false);
  }
  function updateBoardColumns(newColumns) {
    if (!selectedBoard) return;

    const updatedBoard = {
      ...selectedBoard,
      columns: newColumns,
    };

    setTodos(todos.map((b) => (b.id === selectedBoard.id ? updatedBoard : b)));
    setSelectedBoard(updatedBoard);
  }

  useEffect(() => {
    if (todos.length > 0 && selectedBoard) {
      const updatedBoard = todos.find((b) => b.id === selectedBoard.id);
      if (updatedBoard) {
        setSelectedBoard(updatedBoard);
      }
    }
  }, [todos]);
  

  return (
    <div className="boardPage">
      <div className="sideNav-board">
        <h2>ALL BOARDS ({todos.length})</h2>
        <ul className="allBoards">
          {todos?.map((x) => (
            <li className="board" key={x.id}>
              <button onClick={() => handleSelectBoard(x)}>{x.name}</button>
            </li>
          ))}
        </ul>
        <div className="sideNav-boardBtn">
          <button className="modal-btn" onClick={() => openModal(false)}>
            + Create New Board
          </button>

          <button
            className="modal-btn"
            onClick={() => openModal(true)}
            disabled={!selectedBoard}
          >
            Edit Board
          </button>
        </div>

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-btn" onClick={closeModal}>
                ✖
              </button>
              <NewEditBoard closeModal={closeModal} />
            </div>
          </div>
        )}

        {isColumnModalOpen && (
          <AddColumnModal
            closeModal={closeColumnModal}
            selectedBoard={selectedBoard}
            updateBoardColumns={updateBoardColumns}
          />
        )}
      </div>
      {selectedBoard && (
        <BoardColumns board={selectedBoard} openColumnModal={openColumnModal} />
      )}
    </div>
  );
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function BoardColumns({ board, openColumnModal }) {
  const [selectedTask, setSelectedTask] = useState(null);

  if (!board || !Array.isArray(board.columns)) {
    return <p>Bu board için kolon bulunmamaktadır.</p>;
  }

  function openTaskModal(task) {
    console.log("Tıklanan Task:", task); 
    setSelectedTask(task);
  }

  function closeTaskModal() {
    setSelectedTask(null);
  }

  return (
    <div className="boardColumns">
      {board.columns.map((column, columnIndex) => (
        <div className="boardColumn" key={columnIndex}>
          <div className="boardColumnTitle">
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: getRandomColor(),
                display: "inline-block",
              }}
            ></span>
            <h3>{column.name}</h3>
          </div>
          {(Array.isArray(column.tasks) ? column.tasks : []).length > 0 ? (
            column.tasks.map((task, taskIndex) => (
              <div className="columnTodo" key={taskIndex} onClick={() => openTaskModal(task)}>
                <p>{task.title}</p>
                {task.subtasks && task.subtasks.length > 0 && (
                  <span className="board-subtasks-info">
                    {task.subtasks.filter(st => st.isCompleted).length} of {task.subtasks.length} subtasks
                  </span>
                )}
              </div>
            ))
          ) : (
            <p>Bu sütunda görev bulunmamaktadır.</p>
          )}
        </div>
      ))}
      
      <div className="boardColumn new-column" onClick={openColumnModal}>
        <p>+ New Column</p>
      </div>

      {selectedTask && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={closeTaskModal}>✖</button>
            <ViewTask task={selectedTask} closeModal={closeTaskModal} />
          </div>
        </div>
      )}
    </div>
  );
}
