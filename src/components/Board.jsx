import { TodoContext } from "./TodoContext";
import { useContext, useState, useEffect } from "react";
import NewEditBoard from "./NewEditBoard";

export default function Board() {
  const { todos, setEdit, setCurrentBoard } = useContext(TodoContext);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    console.log("Seçilen Board:", selectedBoard);
  }, [selectedBoard]);

  function handleSelectBoard(board) {
    console.log("Seçilen Board:", board);
    setSelectedBoard({ ...board, columns: board.columns || [] });
    setEdit(false);
    setCurrentBoard(board);
  }

  function openModal(isEditMode) {
    setEdit(isEditMode);
    setIsModalOpen(true); 
  }

  function closeModal() {
    setIsModalOpen(false); 
    setEdit(false);
    setCurrentBoard(null);
  }

  return (
    <div className="boardPage">
      <ul className="allBoards">
        {todos?.map((x) => (
          <li className="board" key={x.id}>
            <button onClick={() => handleSelectBoard(x)}>{x.name}</button>
          </li>
        ))}
      </ul>
      <button className="modal-btn" onClick={() => openModal(false)}>+ Create New Board</button>
      
      <button 
        className="modal-btn" 
        onClick={() => openModal(true)} 
        disabled={!selectedBoard} 
      >
        Edit Board
      </button>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={closeModal}>✖</button>
            <NewEditBoard closeModal={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
}
