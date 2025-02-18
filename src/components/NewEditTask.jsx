import { useContext, useState, useEffect } from "react";
import { TodoContext } from "./TodoContext";

export default function NewEditTask({ closeModal, task }) {
  const { todos, setTodos, isEdit, setEdit, currentBoard, setCurrentBoard } = useContext(TodoContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState([{ id: 0, name: "" }]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    console.log("Güncellenen currentBoard:", currentBoard);
    console.log("Güncellenen Todos:", todos);
  }, [currentBoard, todos]);
  
  useEffect(() => {
    const updatedBoard = todos.find((b) => b.id === currentBoard?.id);
    if (updatedBoard && updatedBoard.columns.length !== currentBoard?.columns.length) {
      console.log("✅ `setCurrentBoard` güncellendi:", updatedBoard);
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
  }, [isEdit, task, currentBoard ]); 

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
    const formObj = Object.fromEntries(formData);
    const newTaskObj = {
      id: crypto.randomUUID(),
      title: formObj.title,
      description: formObj.description,
      subtasks: subtasks.length > 0 ? subtasks.map(st => ({
        id: crypto.randomUUID(),
        name: st.name,
        isCompleted: false
      })) : [],
      status: formObj.status,
    };
    

    const updatedTodos = todos.map((board) =>
      board.id === currentBoard.id
        ? {
            ...board,
            columns: board.columns.map((col) =>
              col.name === formObj.status
                ? { ...col, tasks: [...(col.tasks || []), newTaskObj] }
                : col
            ),
          }
        : board
    );

    setTodos(updatedTodos);

    const updatedBoard = updatedTodos.find((b) => b.id === currentBoard.id);
    setCurrentBoard(updatedBoard);

    if (typeof closeModal === "function") {
      closeModal();
    } else {
      console.error("closeModal fonksiyonu undefined!");
    }
  }

  return (
    <div className="taskModalOverlay">
      <div className="taskModalContent">
        <button className="taskModalCloseBtn" onClick={closeModal}>✖</button>
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
                  value={subtask.title}
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
            <button className="create-task-btn" disabled={subtasks.length === 0}>{isEdit ? "Save Changes" : "Create Task"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
