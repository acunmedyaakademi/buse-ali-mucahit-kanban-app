import { useState, useEffect } from "react";
import { DeleteSvg } from "../Svg";

export default function AddColumnModal({ closeModal, selectedBoard, updateBoardColumns }) {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    if (selectedBoard?.columns) {
      setColumns([...selectedBoard.columns]);
    }
  }, [selectedBoard]);

  const handleColumnChange = (index, value) => {
    setColumns((prev) => {
      const updated = [...prev];
      updated[index].name = value;
      return updated;
    });
  };

  const deleteColumn = (e, index) => {
    e.preventDefault();
    setColumns((prev) => prev.filter((_, i) => i !== index));
  };

  const addColumn = () => {
    setColumns((prev) => [...prev, { id: Date.now(), name: "" }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateBoardColumns([...columns]);  // ✅ Sadece mevcut kolonları gönderiyoruz
    closeModal();
  };

  return (
    <div className="addColumnModalOverlay" onClick={closeModal}>
      <div className="addColumnModalContent" onClick={(e) => e.stopPropagation()}>
        <button className="addColumncloseBtn" onClick={closeModal}>✖</button>
        <h2>Add New Column</h2>

        <form onSubmit={handleSubmit}>
          <label>Name</label>
          <input
            className="addColumnModalNameInput"
            type="text"
            value={selectedBoard?.name || ""}
            disabled
          />

          <label>Columns</label>
          {columns.map((column, index) => (
            <div key={column.id} className="addColumnModalColumnInput">
              <input
                type="text"
                value={column.name}
                onChange={(e) => handleColumnChange(index, e.target.value)}
                placeholder="Column Name"
                required
              />
              <button
                type="button"
                className="addColumnModalDelete"
                onClick={(e) => deleteColumn(e, index)}
              >
                <DeleteSvg width={20} height={20} />
              </button>
            </div>
          ))}

          <button type="button" className="addColumnModalAddBtn" onClick={addColumn}>
            + Add New Column
          </button>
          <button type="submit" className="addColumnModalSaveBtn">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
