import { useContext, useState, useEffect, useRef } from "react";
import { TodoContext } from "./TodoContext";

export default function ViewTask({ task, closeModal }) {
  const { todos, setTodos, currentBoard, setCurrentBoard } = useContext(TodoContext);
  const [status, setStatus] = useState(task.status);
  const [subtasks, setSubtasks] = useState(task.subtasks || []);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const modalRef = useRef(null);

  useEffect(() => {
    if (task?.subtasks && Array.isArray(task.subtasks)) {
      setSubtasks(task.subtasks.map(st => ({ ...st }))); 
    }
  }, [task]);

  useEffect(() => {
    setStatus(task.status);
    setSubtasks(task.subtasks || []);
  }, [task]);

  // ➡️ Modal dışına tıklayınca kapanma
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeModal]);

  function toggleSubtask(index) {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].isCompleted = !updatedSubtasks[index].isCompleted;
    setSubtasks(updatedSubtasks);

    setTodos((prevTodos) =>
      prevTodos.map((board) =>
        board.id === currentBoard.id
          ? {
              ...board,
              columns: board.columns.map((col) =>
                col.title === task.status
                  ? {
                      ...col,
                      tasks: col.tasks.map((t) =>
                        t.id === task.id
                          ? { ...t, subtasks: updatedSubtasks }
                          : t
                      ),
                    }
                  : col
              ),
            }
          : board
      )
    );
  }

  function updateStatus(newStatus) {
    if (newStatus === status) return; 
  
    setStatus(newStatus);
    setIsDropdownOpen(false);
  
    const updatedTodos = todos.map((board) => {
      if (board.id !== currentBoard.id) return board;
  
      return {
        ...board,
        columns: board.columns.map((col) => {
          if (col.name === status) {
            return { ...col, tasks: col.tasks.filter((t) => t.id !== task.id) };
          }
  
          if (col.name === newStatus) {
            return { ...col, tasks: [...col.tasks, { ...task, status: newStatus }] };
          }
  
          return col;
        }),
      };
    });
  
    setTodos(updatedTodos);
    const updatedBoard = updatedTodos.find((b) => b.id === currentBoard.id);
    if (updatedBoard) setCurrentBoard(updatedBoard);
  }

  return (
    <div className="taskModalOverlay">
      <div className="taskModalContent" ref={modalRef}>
        <h2 className="taskTitle">{task.title}</h2>
        <p className="taskDescription">{task.description}</p>

        <label className="subtasksLabel">
          Subtasks ({subtasks.filter((st) => st.isCompleted).length} of {subtasks.length})
        </label>
        <div className="subtasksContainer">
          {subtasks.map((subtask, index) => (
            <label key={index} className="subtaskItem">
              <input
                type="checkbox"
                checked={!!subtask.isCompleted}
                onChange={() => toggleSubtask(index)}
              />
              <span className={subtask.isCompleted ? "completed" : "notCompleted"}>
                {subtask.title || subtask.name}
              </span>
            </label>
          ))}
        </div>

        <label className="statusLabel">Current Status</label>
        <div className="selectWrapper" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
          <div className="statusSelect">
            {status}
            <img src="img/down-icon.svg" alt="Dropdown Arrow" />
          </div>

          {isDropdownOpen && (
            <div className="statusDropdown">
              {currentBoard.columns.map((col) => (
                <div
                  key={col.name}
                  className={`statusOption ${col.name === status ? "selected" : ""}`}
                  onClick={() => updateStatus(col.name)}
                >
                  {col.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
