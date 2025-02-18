import { useState, useEffect } from "react";
import { DeleteSvg } from "../Svg"

export default function AddColumnModal({ closeModal, selectedBoard, updateBoardColumns }) {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (selectedBoard) {
      setColumns(selectedBoard.columns || []);
    }
  }, [selectedBoard]);

  function handleColumnChange(index, value) {
    const newColumns = [...columns];
    newColumns[index].name = value;
    setColumns(newColumns);
  }

  function addColumn() {
    setColumns([...columns, { id: Date.now(), name: "" }]);
  }

  function deleteColumn(index) {
    const newColumns = columns.filter((_, i) => i !== index);
    setColumns(newColumns);
  }

  function handleSubmit(e) {
    e.preventDefault();
    updateBoardColumns(columns);
    closeModal();
  }

  return (
    <div className="addColumnModalOverlay">
      <div className="addColumnModalContent">
        <button className="addColumncloseBtn" onClick={closeModal}>✖</button>
        <h2>Add New Column</h2>
        
        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input className="addColumnModalNameInput" type="text" value={selectedBoard?.name} disabled />

          <label>Columns</label>
          {columns.map((column, index) => (
            <div key={column.id} className="addColumnModalColumnInput">
              <input
                type="text"
                value={column.name}
                onChange={(e) => handleColumnChange(index, e.target.value)}
                required
              />
              <button type="button" className="addColumnModalDelete" onClick={() => deleteColumn(index)}>
                <DeleteSvg width={20} height={20} />
              </button>
            </div>
          ))}

          <button type="button" className="addColumnModalAddBtn" onClick={addColumn}>+ Add New Column</button>
          <button type="submit" className="addColumnModalSaveBtn">Save Changes</button>
        </form>
      </div>
    </div>
  );
}
