import { useContext } from "react";
import { TodoContext } from "./TodoContext";

export default function DeleteModal() {
const {deleteModal} = useContext(TodoContext);
  return (
    <div className="delete-modal-overlay" >
      <div className="deleteModal">
        <h2>Delete this task?</h2>
        <p>
          Are you sure you want to delete the ‘Build settings UI’ task and its
          subtasks? This action cannot be reversed.
        </p>
        <button>Delete</button>
        <button onClick={deleteModal}>Cancel</button>
      </div>
    </div>
  );
}
