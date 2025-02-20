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
import { AddIcon, BoardIconSvg, KanbanLogoSvg } from "../Svg";
import DeleteModal from "./DeleteModal";
import { useTheme } from "./ThemeContext";

export default function MyComponent() {
  const [ismobil, setIsmobil] = useState(window.innerWidth < 768);
  const {
    todos,
    setTodos,
    setEdit,
    setCurrentBoard,
    isEditDeleteBoard,
    setIsEditDeleteBoard,
    setIsDeleteModal,
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
          setIsDeleteModal={setIsDeleteModal}
        />
      ) : (
        <DesktopComponent
          closeModal={closeModal}
          isModalOpen={isModalOpen}
          openModal={openModal}
          deleteModal={deleteModal}
          isDeleteModal={isDeleteModal}
          setIsDeleteModal={setIsDeleteModal}
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
  setIsDeleteModal,
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
            <Dropdown isOpen={isOpen} setIsOpen={setIsOpen} openModal={openModal}/>
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

        {isDeleteModal && (
          <DeleteModal
            type="board"
            item={currentBoard}
            closeModal={() => setIsDeleteModal(false)} // DeleteModal kapanır
            closeParentModal={closeModal} // ✅ Header menüsü kapanır
          />
        )}

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <NewEditBoard closeModal={closeModal} />
            </div>
          </div>
        )}

        {isTaskModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
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
  setIsDeleteModal,
}) {
  const {
    isTaskModalOpen,
    closeTaskModal,
    openTaskModal,
    currentBoard,
    isEditDeleteBoard,
    setIsEditDeleteBoard,
    todos,
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
        <div className="kanbanLogo">
          <img src="img/kanban-site-logo.svg" alt="img logo" />
          <KanbanLogoSvg fill="#000112" />
        </div>
        <div className="header-top-bottom">
          <p className="desktopHeaderName">{currentBoard?.name}</p>
          <div className="header-down">
            <button
              className="headerAddTaskBtn"
              onClick={() => openTaskModal(false)}
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
              <NewEditBoard closeModal={closeModal} />
            </div>
          </div>
        )}

        {isDeleteModal && (
          <DeleteModal
            type="board"
            item={currentBoard}
            closeModal={() => setIsDeleteModal(false)} // DeleteModal kapanır
            closeParentModal={closeModal}// header menüsü kapanır
          />
        )}

        {isTaskModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <NewEditTask
                closeModal={closeTaskModal}
              />
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
}

function Dropdown({ isOpen, setIsOpen, openModal }) {
  const dropdownRef = useRef(null);
  const { darkMode, toggleTheme } = useTheme();
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
    setCurrentBoard({
      ...board,
      columns: board.columns ?? [], 
    });
    setEdit(false);
    setIsOpen(false);
  }

  useEffect(() => {
    if (!currentBoard && todos.length > 0) {
      setCurrentBoard(todos[0]);
    }
  }, [todos, currentBoard, setCurrentBoard]);  

  const handleCreateNewBoard = () => {
    setIsOpen(false);        // ✅ Dropdown kapat
    openModal(false);        // ✅ NewEditBoard modal aç
  };

  return (
    <Fragment>
      <div className="dropdown" ref={dropdownRef}>
        <button onClick={() => setIsOpen(!isOpen)} className="dropdown-btn">
          {currentBoard?.name} ({todos.length})
          <img src="img/down-icon.svg" alt="" />
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
                <BoardIconSvg />
                {x.name}
              </button>
            </li>
          ))}
          <button className="modal-btn" onClick={handleCreateNewBoard}>
            <BoardIconSvg /> + Create New Board
          </button>
          <div className="navBar-themeBtn">
            <span className="white-mode-background">
              <img src="img/white-mode-theme-icon.svg" alt="" />
            </span>
            <label className="bg-theme-checkbox">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={toggleTheme}
              />
              <span className="slider"></span>
            </label>
            <span className="icon">
              <img src="img/dark-mode-theme-icon.svg" alt="" />
            </span>
          </div>
        </ul>
      </div>
    </Fragment>
  );
}
