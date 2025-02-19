import { TodoContext } from "./TodoContext";
import { useContext, useState, useEffect } from "react";
import NewEditBoard from "./NewEditBoard";
import AddColumnModal from "./AddColumnModal";
import ViewTask from "./ViewTask";
import { BoardIconSvg, HideIconSvg, ShowIconSvg } from "../Svg";
import { useTheme } from "./ThemeContext";

export default function Board() {
  const { todos, setTodos, setEdit, setCurrentBoard } = useContext(TodoContext);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const { darkMode, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  function toggleSidebar() {
    setIsSidebarOpen((prev) => !prev);
  }

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
    <div className={`boardPage ${darkMode ? "dark-mode" : "light-mode"}`}>
      <div className={`sideNav-board ${isSidebarOpen ? "open" : "closed"}`}>
        <ul className="allBoards">
          <h2>ALL BOARDS ({todos.length})</h2>
          {todos?.map((x) => (
            <li className={`board ${selectedBoard?.id === x.id ? "active" : ""}`} key={x.id}>
              <button onClick={() => handleSelectBoard(x)}>
                <BoardIconSvg />
                {x.name}
              </button>
            </li>
          ))}
          <div className="sideNav-boardBtn">
            <button className="modal-btn" onClick={() => openModal(false)}>
              <BoardIconSvg />+ Create New Board
            </button>
          </div>
        </ul>

        {isSidebarOpen && (
          <div className="hideIcon" onClick={toggleSidebar}>
            <HideIconSvg />
            <p>Hide Sidebar</p>
          </div>
        )}

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

        <div className="navBar-bottom">
          <div className="navBar-themeBtn">
            <span className="white-mode-background">☀️</span>
            <label className="bg-theme-checkbox">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={toggleTheme}
              />
              <span className="slider"></span>
            </label>
            <span className="icon">🌙</span>
          </div>
        </div>
      </div>

      <div className="main-content">
      {selectedBoard && (
        <BoardColumns board={selectedBoard} openColumnModal={openColumnModal} />
      )}

      {!isSidebarOpen && (
        <div className="showSidebar-btn" onClick={toggleSidebar}>
          <ShowIconSvg />
        </div>
      )}
      </div>
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
              <div
                className="columnTodo"
                key={taskIndex}
                onClick={() => openTaskModal(task)}
              >
                <p>{task.title}</p>
                {task.subtasks && task.subtasks.length > 0 && (
                  <span className="board-subtasks-info">
                    {task.subtasks.filter((st) => st.isCompleted).length} of {" "}
                    {task.subtasks.length} subtasks
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
            <button className="close-btn" onClick={closeTaskModal}>
              ✖
            </button>
            <ViewTask task={selectedTask} closeModal={closeTaskModal} />
          </div>
        </div>
      )}
    </div>
  );
}
