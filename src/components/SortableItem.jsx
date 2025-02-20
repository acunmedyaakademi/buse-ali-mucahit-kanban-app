import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

export default function SortableItem({ task, openTaskModal }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });
  const [isDragging, setIsDragging] = useState(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? "grabbing" : "pointer",
  };

  const handlePointerDown = (e) => {
    setIsDragging(false);

    // kullanıcı uzun basarsa sürükleme olarak algılanır
    const timeout = setTimeout(() => {
      setIsDragging(true);
      listeners.onPointerDown(e);
    }, 150); // 150ms sonra dragging aktif olur

    const clearDrag = () => {
      clearTimeout(timeout);  // basılı tutmazsa sürükleme iptal
      window.removeEventListener("pointerup", clearDrag);
    };

    window.addEventListener("pointerup", clearDrag);
  };

  const handleClick = (e) => {
    if (!isDragging) {
      openTaskModal(task);  // sadece sürükleme başlamamışsa modal açılır
    }
  };

  return (
    <div
      className="todo"
      ref={setNodeRef}
      style={style}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      {...attributes}
    >
      <p>{task.title}</p>
      {task.subtasks?.length > 0 && (
        <span className="board-subtasks-info">
          Subtasks ({task.subtasks.filter((st) => st.isCompleted).length} of {task.subtasks.length})
        </span>
      )}
    </div>
  );
}
