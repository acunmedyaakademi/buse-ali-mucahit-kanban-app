import { useContext, useState, useEffect, useRef } from "react";
import { TodoContext } from "./TodoContext";
import DeleteModal from "./DeleteModal";
import NewEditTask from "./NewEditTask";

export default function ViewTask({ task, closeModal }) {
  const {
    todos,
    setTodos,
    currentBoard,
    setCurrentBoard,
    setEdit,
  } = useContext(TodoContext);

  const [status, setStatus] = useState(task.status);
  const [subtasks, setSubtasks] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTaskMenuOpen, setIsTaskMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const modalRef = useRef(null);

  // 🎯 Task değiştiğinde alt görevleri ve durumu güncelle
  useEffect(() => {
    setStatus(task.status);
    setSubtasks(
      (task.subtasks || []).map((st) => ({
        ...st,
        id: st.id || crypto.randomUUID(), // Her alt göreve benzersiz bir ID ver
      }))
    );
  }, [task]);

  // ✅ Modal dışına tıklayınca kapatma
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setIsModalOpen(false);
        setIsTaskMenuOpen(false);
        setIsDeleteModalOpen(false);
        closeModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeModal]);

  // 📝 Alt görev tamamlama durumu değiştir
  const toggleSubtask = (id) => {
    const updatedSubtasks = subtasks.map((subtask) =>
      subtask.id === id ? { ...subtask, isCompleted: !subtask.isCompleted } : subtask
    );
    setSubtasks(updatedSubtasks);

    const updatedTodos = todos.map((board) =>
      board.id === currentBoard.id
        ? {
            ...board,
            columns: board.columns.map((col) =>
              col.name === task.status
                ? {
                    ...col,
                    tasks: col.tasks.map((t) =>
                      t.id === task.id ? { ...t, subtasks: updatedSubtasks } : t
                    ),
                  }
                : col
            ),
          }
        : board
    );

    setTodos(updatedTodos);
  };

  // 🔄 Durum (status) güncelleme
  const updateStatus = (newStatus) => {
    if (newStatus === status) return;

    const updatedTodos = todos.map((board) =>
      board.id === currentBoard.id
        ? {
            ...board,
            columns: board.columns.map((col) => {
              if (col.name === status) {
                return { ...col, tasks: col.tasks.filter((t) => t.id !== task.id) };
              }
              if (col.name === newStatus) {
                return {
                  ...col,
                  tasks: [...col.tasks, { ...task, status: newStatus }],
                };
              }
              return col;
            }),
          }
        : board
    );

    setTodos(updatedTodos);
    setCurrentBoard(updatedTodos.find((b) => b.id === currentBoard.id));
    setStatus(newStatus);
    setIsDropdownOpen(false);
  };

  // 📝 Modal açma
  const openModal = (isEditMode) => {
    setEdit(isEditMode);
    setIsModalOpen(true);
  };

  return (
    <div className="taskModalOverlay">
      <div className="taskModalContent" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <div className="viewTaskTop">
          <h2 className="taskTitle">{task.title}</h2>
          <img
            src="img/detail-icon.svg"
            alt="Options"
            onClick={(e) => {
              e.stopPropagation();
              setIsTaskMenuOpen((prev) => !prev);
            }}
          />
        </div>

        {isTaskMenuOpen && (
          <div className="edit-delete-board">
            <button onClick={() => openModal(true)} className="editBoard">
              Edit Task
            </button>
            <button onClick={() => setIsDeleteModalOpen(true)} className="deleteBoard">
              Delete Task
            </button>
          </div>
        )}

        {isDeleteModalOpen && (
          <DeleteModal
            type="task"
            item={task}
            closeModal={() => setIsDeleteModalOpen(false)}
            closeParentModal={closeModal}
          />
        )}

        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <NewEditTask closeModal={() => setIsModalOpen(false)} task={task} />
            </div>
          </div>
        )}

        <p className="taskDescription">{task.description}</p>

        <label className="subtasksLabel">
          Subtasks ({subtasks.filter((st) => st.isCompleted).length} of {subtasks.length})
        </label>
        <div className="subtasksContainer">
          {subtasks.map((subtask) => (
            <label key={subtask.id} className="subtaskItem">
              <input
                type="checkbox"
                checked={!!subtask.isCompleted}
                onChange={() => toggleSubtask(subtask.id)}
              />
              <span className="checkmark"></span>
              <span className={subtask.isCompleted ? "completed" : "notCompleted"}>
                {subtask.title}
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
