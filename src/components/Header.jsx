import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  Fragment,
} from "react";
import { TodoContext } from "./TodoContext";
import NewEditTask from "./NewEditTask";
import NewEditBoard from "./NewEditBoard";
import { AddIcon, KanbanLogoSvg } from "../Svg";
import DeleteModal from "./DeleteModal";

export default function MyComponent() {
  const [ismobil, setIsmobil] = useState(window.innerWidth < 768);
  const {
    todos,
    setTodos,
    setEdit,
    setCurrentBoard,
    isEditDeleteBoard,
    setIsEditDeleteBoard,
    deleteModal,
    isDeleteModal,
  } = useContext(TodoContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function openModal(isEditMode) {
    setEdit(isEditMode);
    setIsModalOpen(true);
    console.log("çalıştı");
  }

  function closeModal() {
    setIsModalOpen(false);
    setEdit(false);
  }

  useEffect(() => {
    const handleResize = () => {
      setIsmobil(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    // Temizleme işlemi: event listener'ı component unmount olduğunda kaldırıyoruz
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Fragment>
      {ismobil ? (
        <MobileComponent
          closeModal={closeModal}
          isModalOpen={isModalOpen}
          openModal={openModal}
          deleteModal={deleteModal}
          isDeleteModal={isDeleteModal}
        />
      ) : (
        <DesktopComponent
          closeModal={closeModal}
          isModalOpen={isModalOpen}
          openModal={openModal}
          deleteModal={deleteModal}
          isDeleteModal={isDeleteModal}
        />
      )}
    </Fragment>
  );
}

function MobileComponent({
  openModal,
  isModalOpen,
  closeModal,
  deleteModal,
  isDeleteModal,
}) {
  const {
    isTaskModalOpen,
    closeTaskModal,
    openTaskModal,
    currentBoard,
    isEditDeleteBoard,
    setIsEditDeleteBoard,
  } = useContext(TodoContext);
  const [isOpen, setIsOpen] = useState(false);
  function openIsEditDeleteBoard() {
    setIsEditDeleteBoard(!isEditDeleteBoard);
  }

  return (
    <Fragment>
      {isOpen && (
        <div
          className="dropdown-overlay"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      <div className="header">
        <div className="header-top">
          <img src="img/kanban-site-logo.svg" alt="img logo" />

          <div className="header-top-bottom">
            <Dropdown isOpen={isOpen} setIsOpen={setIsOpen} /> 
            <img src="img/down-icon.svg" alt="" />
          </div>
        </div>

        <div className="header-down">
          <button
            className="addBtn"
            onClick={openTaskModal}
            disabled={!currentBoard}
          >
            <AddIcon />
          </button>
          <img
            onClick={openIsEditDeleteBoard}
            src="img/detail-icon.svg"
            alt=""
          />
        </div>

        {isEditDeleteBoard && (
          <div className="edit-delete-board">
            <button onClick={() => openModal(true)} className="editBoard">
              Edit Board
            </button>
            <button onClick={deleteModal} className="deleteBoard">
              Delete Board
            </button>
          </div>
        )}

        {isDeleteModal && <DeleteModal />}

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-btn" onClick={closeModal}>
                ✖
              </button>
              <NewEditBoard closeModal={closeModal} />
            </div>
          </div>
        )}

        {isTaskModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <button className="close-btn" onClick={closeTaskModal}>
                ✖
              </button>
              <NewEditTask closeModal={closeTaskModal} />
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
}

function DesktopComponent({
  openModal,
  isModalOpen,
  closeModal,
  deleteModal,
  isDeleteModal,
}) {
  const {
    isTaskModalOpen,
    closeTaskModal,
    openTaskModal,
    currentBoard,
    isEditDeleteBoard,
    setIsEditDeleteBoard,
  } = useContext(TodoContext);

  function openIsEditDeleteBoard() {
    setIsEditDeleteBoard(!isEditDeleteBoard);
  }
  return (
    <div className="header">
      <div className="kanbanLogo">
        <img src="img/kanban-site-logo.svg" alt="img logo" />
        <KanbanLogoSvg fill="#000112" />
      </div>
      <div className="header-top-bottom">
        <div className="headerDropdown">
          <Dropdown />
          <img src="img/down-icon.svg" alt="" />
        </div>

        <div className="header-down">
          <button
            className="headerAddTaskBtn"
            onClick={openTaskModal}
            disabled={!currentBoard}
          >
            + Add New Task
          </button>
          <img
            src="img/detail-icon.svg"
            alt=""
            onClick={openIsEditDeleteBoard}
          />
        </div>
      </div>

      {isEditDeleteBoard && (
        <div className="edit-delete-board">
          <button onClick={() => openModal(true)} className="editBoard">
            Edit Board
          </button>
          <button onClick={deleteModal} className="deleteBoard">
            Delete Board
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={closeModal}>
              ✖
            </button>
            <NewEditBoard closeModal={closeModal} />
          </div>
        </div>
      )}

      {isTaskModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={closeTaskModal}>
              ✖
            </button>
            <NewEditTask closeModal={closeTaskModal} />
          </div>
        </div>
      )}
    </div>
  );
}

function Dropdown({ isOpen, setIsOpen }) {
  const dropdownRef = useRef(null);
  const { todos, setTodos, setEdit, currentBoard, setCurrentBoard } =
    useContext(TodoContext);

  // menü dısına tıklanınca
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleSelectBoard(board) {
    setEdit(false); // Düzenleme modunu kapat
    setCurrentBoard(board); // Context'teki currentBoard'u güncelle
    setIsOpen(false); // Dropdown'u kapat
  }

  useEffect(() => {
    if (!currentBoard && todos.length > 0) {
      setCurrentBoard(todos[0]);
    }
  }, [todos, currentBoard, setCurrentBoard]);

  return (
    <Fragment>
      <div className="dropdown" ref={dropdownRef}>
        <button onClick={() => setIsOpen(!isOpen)} className="dropdown-btn">
          {currentBoard?.name} ({todos.length})
        </button>
        <ul className={`dropdownMenu ${isOpen ? "show" : ""}`}>
          <li>
            <p>ALL BOARDS ({todos.length})</p>
          </li>
          {todos?.map((x) => (
            <li
              key={x.id}
              className={currentBoard?.id === x.id ? "active" : ""}
            >
              <button
                className="dropdownBtn"
                onClick={() => handleSelectBoard(x)}
              >
                <img src="img/dropdown-grey-menu-icon.svg" alt="" />
                {x.name}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </Fragment>
  );
}
