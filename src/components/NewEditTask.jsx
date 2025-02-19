import { useContext, useState, useEffect } from "react";
import { TodoContext } from "./TodoContext";
import { DeleteSvg } from "../Svg";

export default function NewEditTask({ closeModal, task }) {
  const { todos, setTodos, isEdit, currentBoard, setCurrentBoard } =
    useContext(TodoContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState([]);
  const [status, setStatus] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // 📝 Düzenleme modunda mevcut task bilgilerini yükle
  useEffect(() => {
    if (isEdit && task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setSubtasks(
        (task.subtasks || []).map((st) => ({
          id: crypto.randomUUID(),
          name: st.title || "",
          isCompleted: st.isCompleted ?? false,
        }))
      );
      setStatus(task.status ?? currentBoard?.columns[0]?.name ?? "");
    } else {
      setTitle("");
      setDescription("");
      setSubtasks([{ id: crypto.randomUUID(), name: "", isCompleted: false }]);
      setStatus(currentBoard?.columns[0]?.name ?? "");
    }
  }, [isEdit, task, currentBoard]);
  

  // ➕ Yeni subtask ekleme
  const addSubtask = () => {
    setSubtasks([
      ...subtasks,
      { id: crypto.randomUUID(), name: "", isCompleted: false },
    ]);
  };

  // 🔄 Subtask düzenleme
  const handleSubtaskChange = (index, value) => {
    const updatedSubtasks = subtasks.map((st, i) =>
      i === index ? { ...st, name: value } : st
    );
    setSubtasks(updatedSubtasks);
  };

  // 🗑️ Subtask silme
  const deleteSubtask = (id) => {
    setSubtasks(subtasks.filter((st) => st.id !== id));
  };

  // ✅ Form gönderme
  const handleSubmit = (e) => {
    e.preventDefault();
  
    const updatedTask = {
      id: isEdit && task?.id ? task.id : crypto.randomUUID(),
      title,
      description,
      subtasks,
      status,
    };
  
    const updatedTodos = todos.map((board) => {
      if (board.id !== currentBoard.id) return board;
  
      const updatedColumns = board.columns.map((col) => {
        if (isEdit) {
          // 🎯 1️⃣ Eski sütundaki task'ı sil
          const filteredTasks = col.tasks.filter((t) => t.id !== task?.id);
  
          // 🆕 2️⃣ Seçili sütuna güncellenmiş task'ı ekle
          if (col.name === updatedTask.status) {
            return { ...col, tasks: [...filteredTasks, updatedTask] };
          }
  
          return { ...col, tasks: filteredTasks }; // Diğer sütunlar için sadece sil
        } else {
          // 📝 Yeni task eklerken sadece ilgili sütuna ekle
          return col.name === updatedTask.status
            ? { ...col, tasks: [...col.tasks, updatedTask] }
            : col;
        }
      });
  
      return { ...board, columns: updatedColumns };
    });
  
    setTodos(updatedTodos);
    setCurrentBoard(updatedTodos.find((b) => b.id === currentBoard.id));
    closeModal?.();
  };
  
  

  return (
    <div className="taskModalOverlay" onClick={closeModal}>
      <div className="taskModalContent" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
        <h2>{isEdit ? "Edit Task" : "Add New Task"}</h2>
        <button onClick={closeModal}><DeleteSvg /></button>
        </div>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <div className="addTaskInputGroup">
            <label>Title</label>
            <input
              type="text"
              name="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="addTaskInputGroup">
            <label>Description</label>
            <textarea
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. It’s always good to take a break..."
            />
          </div>

          <div className="subtask-section">
            <label>Subtasks</label>
            {subtasks.map((subtask, index) => (
              <div key={subtask.id} className="subtaskInput">
                <input
                  type="text"
                  value={subtask.name} // ✅ Mevcut subtask adı inputta görünür
                  onChange={(e) => handleSubtaskChange(index, e.target.value)}
                  required
                />
                {subtasks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => deleteSubtask(subtask.id)}
                  >
                    <DeleteSvg />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="addSubtaskBtn"
              onClick={addSubtask}
            >
              + Add New Subtask
            </button>
          </div>

          <div className="addTaskInputGroup">
            <label className="statusLabel">Current Status</label>
            <div
              className="selectWrapper"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="statusSelect">
                {status}
                <img src="img/down-icon.svg" alt="Dropdown Arrow" />
              </div>

              {isDropdownOpen && (
                <div className="statusDropdown">
                  {currentBoard.columns.map((col) => (
                    <div
                      key={col.name}
                      className={`statusOption ${
                        col.name === status ? "selected" : ""
                      }`}
                      onClick={() => setStatus(col.name)}
                    >
                      {col.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="submit-btn-group">
            <button
              className="create-task-btn"
              disabled={subtasks.length === 0}
            >
              {isEdit ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
