import { useContext } from "react";
import { TodoContext } from "./TodoContext";

export default function DeleteModal() {
const { deleteModal, setIsDeleteModal, todos, setTodos, currentBoard, setCurrentBoard, setEdit} = useContext(TodoContext);

function handleDelete(id) {
  const updatedTodos = todos.filter((todo) => todo.id !== id);
  
  setTodos(updatedTodos);
  setCurrentBoard(null);
  deleteModal();
}

  return (
    <div className="delete-modal-overlay" >
      <div className="deleteModal">
        <h2>Delete this task?</h2>
        <p>
          Are you sure you want to delete the ‘Build settings UI’ task and its
          subtasks? This action cannot be reversed.
        </p>
        <button onClick={() => handleDelete(currentBoard.id)}>Delete</button>
        <button onClick={deleteModal}>Cancel</button>
      </div>
    </div>
  );
}
