import { Fragment, useContext } from "react";
import { TodoContext } from "./TodoContext";

export default function DeleteModal({ type, item, closeModal, closeParentModal }) {
  const { todos, setTodos, currentBoard, setCurrentBoard, setIsDeleteModal } = useContext(TodoContext);

  function handleDelete() {
    let updatedTodos = [...todos];

    if (type === "board") {
      // board silme işlemi
      updatedTodos = todos.filter((todo) => todo.id !== currentBoard.id);
      setTodos(updatedTodos);

      // silindikten sonra currentBoard kalan ilk board olur (yoksa null)
      setCurrentBoard(updatedTodos.length > 0 ? updatedTodos[0] : null);

      setIsDeleteModal(false); // context modal kapanır
    }

    if (type === "task") {
      // task silme işlemi
      updatedTodos = todos.map((board) =>
        board.id === currentBoard.id
          ? {
              ...board,
              columns: board.columns.map((col) => ({
                ...col,
                tasks: col.tasks.filter((task) => task.id !== item.id),
              })),
            }
          : board
      );

      setTodos(updatedTodos);
      setCurrentBoard(updatedTodos.find((b) => b.id === currentBoard.id)); // güncel board'u bul
    }

    closeModal(); // DeleteModal kapanır
    if (closeParentModal) closeParentModal(); // Bağlı modal kapanır
  }

  return (
    <Fragment>
      <div className="delete-modal-overlay" onClick={closeModal}>
        <div className="deleteModal" onClick={(e) => e.stopPropagation()}>
          <h4>Delete this {type === "board" ? "board" : "task"}?</h4>
          <p>
            Are you sure you want to delete '<strong>{item?.name || item?.title}</strong>'?  
            This action cannot be reversed.
          </p>
          <div className="deleteModalBtns">
          <button className="deleteButton" onClick={handleDelete}>Delete</button>
          <button className="cancelButton" onClick={closeModal}>Cancel</button>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
