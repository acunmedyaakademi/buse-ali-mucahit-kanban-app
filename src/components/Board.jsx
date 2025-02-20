import { TodoContext } from "./TodoContext";
import { useContext, useState, useEffect } from "react";
import NewEditBoard from "./NewEditBoard";
import AddColumnModal from "./AddColumnModal";
import ViewTask from "./ViewTask";
import { BoardIconSvg, HideIconSvg, ShowIconSvg } from "../Svg";
import { useTheme } from "./ThemeContext";

export default function Board() {
  const { todos, setTodos, setEdit, currentBoard, setCurrentBoard } = useContext(TodoContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const { darkMode, toggleTheme } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (todos.length > 0 && !currentBoard) {
      setCurrentBoard(todos[0]); // İlk board varsayılan olarak seçilsin
    }
  }, [todos, currentBoard, setCurrentBoard]);

  const openModal = (isEditMode) => {
    setEdit(isEditMode);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEdit(false);
  };

  const openColumnModal = () => setIsColumnModalOpen(true);
  const closeColumnModal = () => setIsColumnModalOpen(false);
  const openTaskModal = (task) => setSelectedTask(task);
  const closeTaskModal = () => setSelectedTask(null);

  const updateBoardColumns = (newColumns) => {
    if (!currentBoard) return;

    const updatedBoard = { ...currentBoard, columns: newColumns };

    setTodos((prevTodos) =>
      prevTodos.map((board) =>
        board.id === currentBoard.id ? updatedBoard : board
      )
    );

    setCurrentBoard(updatedBoard); // Context üzerinden güncelle
  };

  return (
    <div className={`boardPage ${darkMode ? "dark-mode" : "light-mode"}`}>
      <Sidebar
        todos={todos}
        currentBoard={currentBoard}
        openModal={openModal}
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        darkMode={darkMode}
        toggleTheme={toggleTheme}
      />

      <div className="main-content">
        {currentBoard ? (
          <BoardColumns
            board={currentBoard}
            openColumnModal={openColumnModal}
            openTaskModal={openTaskModal}
          />
        ) : (
          <p>No board selected.</p>
        )}
      </div>

      {isModalOpen && (
        <Modal closeModal={closeModal}>
          <NewEditBoard closeModal={closeModal} />
        </Modal>
      )}

      {isColumnModalOpen && (
        <Modal closeModal={closeColumnModal}>
          <AddColumnModal
            closeModal={closeColumnModal}
            selectedBoard={currentBoard}
            updateBoardColumns={updateBoardColumns}
          />
        </Modal>
      )}

      {selectedTask && (
        <Modal closeModal={closeTaskModal}>
          <ViewTask task={selectedTask} closeModal={closeTaskModal} />
        </Modal>
      )}
    </div>
  );
}

function Sidebar({
  todos,
  currentBoard,
  openModal,
  isSidebarOpen,
  toggleSidebar,
  darkMode,
  toggleTheme,
}) {
  const { setCurrentBoard, setEdit } = useContext(TodoContext);

  const handleSelectBoard = (board) => {
    setCurrentBoard(board); // Context üzerinden board güncellenir
    setEdit(false);
  };

  return (
    <div className={`sideNav-board ${isSidebarOpen ? "open" : "closed"}`}>
      <ul className="allBoards">
        <h2>ALL BOARDS ({todos.length})</h2>
        {todos.map((board) => (
          <li
            key={board.id}
            className={`board ${currentBoard?.id === board.id ? "active" : ""}`}
          >
            <button onClick={() => handleSelectBoard(board)}>
              <BoardIconSvg />
              {board.name}
            </button>
          </li>
        ))}
        <button className="modal-btn" onClick={() => openModal(false)}>
          <BoardIconSvg /> + Create New Board
        </button>
      </ul>
      <div className="navBar-bottom">
        <label className="bg-theme-checkbox">
          <input type="checkbox" checked={darkMode} onChange={toggleTheme} />
          <span className="slider"></span>
        </label>
        <button onClick={toggleSidebar}>
          {isSidebarOpen ? <HideIconSvg /> : <ShowIconSvg />}
        </button>
      </div>
    </div>
  );
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  return "#" + Array.from({ length: 6 }, () => letters[Math.floor(Math.random() * 16)]).join("");
}

function BoardColumns({ board, openColumnModal, openTaskModal }) {
  return (
    <div className="boardColumns">
      {board.columns?.length ? (
        board.columns.map((column, i) => (
          <div className="boardColumn" key={i}>
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
            {column.tasks?.length > 0 ? (
              column.tasks.map((task, taskIndex) => (
                <div
                  className="columnTodo"
                  key={taskIndex}
                  onClick={() => openTaskModal(task)}
                >
                  <p>{task.title}</p>
                  {task.subtasks && task.subtasks.length > 0 && (
                    <span className="board-subtasks-info">
                      Subtasks ({task.subtasks.filter((st) => st.isCompleted).length} of {task.subtasks.length})
                    </span>
                  )}
                </div>
              ))
            ) : (
              <div className="emptyColumnBorder"></div>
            )}
          </div>
        ))
      ) : (
        <div className="emptyBoard">
          <h5>This board is empty.</h5>
          <button onClick={openColumnModal}>+ Add New Column</button>
        </div>
      )}
      <div className="boardColumn new-column" onClick={openColumnModal}>
        <p>+ New Column</p>
      </div>
    </div>
  );
}

function Modal({ children, closeModal }) {
  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={closeModal}>✖</button>
        {children}
      </div>
    </div>
  );
}
