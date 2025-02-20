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
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true); // Kapanış animasyonu başlat
    setTimeout(() => {
      closeModal(); // Animasyon bittikten sonra modalı kapat
    }, 400); 
  };

  useEffect(() => {
    setIsClosing(false); // Modal açılırken resetle
  }, []);

  // düzenleme modunda mevcut task bilgilerini yükle
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
  

  // yeni subtask ekleme
  const addSubtask = () => {
    setSubtasks([
      ...subtasks,
      { id: crypto.randomUUID(), name: "", isCompleted: false },
    ]);
  };

  // subtask düzenleme
  const handleSubtaskChange = (index, value) => {
    const updatedSubtasks = subtasks.map((st, i) =>
      i === index ? { ...st, name: value } : st
    );
    setSubtasks(updatedSubtasks);
  };

  // sbtask silme
  const deleteSubtask = (id) => {
    setSubtasks(subtasks.filter((st) => st.id !== id));
  };

  // form gönderme
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
        const filteredTasks = (col.tasks ?? []).filter((t) => t.id !== task?.id);
      
        if (isEdit) {
          return col.name === updatedTask.status
            ? { ...col, tasks: [...filteredTasks, updatedTask] }
            : { ...col, tasks: filteredTasks };
        }
      
        return col.name === updatedTask.status
          ? { ...col, tasks: [...(col.tasks ?? []), updatedTask] }
          : col;
      });
      
  
      return { ...board, columns: updatedColumns };
    });
  
    setTodos(updatedTodos);
    setCurrentBoard(updatedTodos.find((b) => b.id === currentBoard.id));
    closeModal?.();
  };
  
  

  return (
    <div className={`taskModalOverlay ${isClosing ? "closing" : "open"}`} onClick={handleClose}>
      <div className="taskModalContent" onClick={(e) => e.stopPropagation()}>
        <div className="modalHeader">
        <h2>{isEdit ? "Edit Task" : "Add New Task"}</h2>
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
                  value={subtask.name} // mevcut subtask adı inputta görünür
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
