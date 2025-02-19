import { useContext, useState, useEffect } from "react";
import { TodoContext } from "./TodoContext";

export default function NewEditTask({ closeModal, task }) {
  const { todos, setTodos, isEdit, setEdit, currentBoard, setCurrentBoard } = useContext(TodoContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState([{ id: 0, name: "" }]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const updatedBoard = todos.find((b) => b.id === currentBoard?.id);
    if (updatedBoard && updatedBoard.columns.length !== currentBoard?.columns.length) {
      setCurrentBoard(updatedBoard);
    }
  }, [todos]); 

  useEffect(() => {
    if (currentBoard?.columns) {
      setStatus(currentBoard.columns[0]?.name || "");
    }
  }, [currentBoard]);

  useEffect(() => {
    if (isEdit && task) {
      setTitle(task.title);
      setDescription(task.description);
      setSubtasks(task.subtasks || [{ id: 0, name: "" }]);
      setStatus(task.status || (currentBoard?.columns[0]?.name || ""));
    } else {
      setStatus(currentBoard?.columns[0]?.name || "");
    }
  }, [isEdit, task, currentBoard]); 

  function addSubtask() {
    setSubtasks([...subtasks, { id: subtasks.length, name: "" }]);
  }

  function handleSubtaskChange(index, value) {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].name = value;
    setSubtasks(updatedSubtasks);
  }

  function deleteSubtask(id) {
    setSubtasks(subtasks.filter((x) => x.id !== id));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newTaskObj = {
      id: crypto.randomUUID(),
      title: formData.get("title"),
      description: formData.get("description"),
      subtasks: subtasks.map(st => ({
        id: crypto.randomUUID(),
        name: st.name,
        isCompleted: false
      })),
      status: formData.get("status"),
    };

    const updatedTodos = todos.map((board) =>
      board.id === currentBoard.id
        ? {
            ...board,
            columns: board.columns.map((col) =>
              col.name === newTaskObj.status
                ? { ...col, tasks: [...(col.tasks || []), newTaskObj] }
                : col
            ),
          }
        : board
    );

    setTodos(updatedTodos);
    setCurrentBoard(updatedTodos.find((b) => b.id === currentBoard.id));
    closeModal?.();
  }

  return (
    <div className="taskModalOverlay" onClick={closeModal}>
      <div className="taskModalContent" onClick={(e) => e.stopPropagation()}>
        <h2>{isEdit ? "Edit Task" : "Add New Task"}</h2>
        <form autoComplete="off" onSubmit={handleSubmit}>
          <div className="addTaskInputGroup">
            <label>Title</label>
            <input
              type="text"
              name="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Take coffee break"
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
                  value={subtask.name}
                  onChange={(e) => handleSubtaskChange(index, e.target.value)}
                  required
                />
                {subtasks.length > 1 && (
                  <button type="button" onClick={() => deleteSubtask(subtask.id)}>❌</button>
                )}
              </div>
            ))}
            <button type="button" className="addSubtaskBtn" onClick={addSubtask}>
              + Add New Subtask
            </button>
          </div>
          <div className="addTaskInputGroup">
            <label>Status</label>
            <select name="status" value={status} onChange={(e) => setStatus(e.target.value)}>
              {currentBoard?.columns.map((col) => (
                <option key={col.name} value={col.name}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>
          <div className="submit-btn-group">
            <button className="create-task-btn" disabled={subtasks.length === 0}>
              {isEdit ? "Save Changes" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
