import React, { useState, useEffect, useContext, useRef, Fragment } from "react";
import { TodoContext } from "./TodoContext";
import NewEditTask from "./NewEditTask";
import NewEditBoard from "./NewEditBoard";
import DeleteModal from "./DeleteModal";
export default function MyComponent() {
  const [ismobil, setIsmobil] = useState(window.innerWidth < 600);
  const { todos, setTodos, setEdit, setCurrentBoard } = useContext(TodoContext);
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
      setIsmobil(window.innerWidth < 600);
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
        />
      ) : (
        <DesktopComponent
          closeModal={closeModal}
          isModalOpen={isModalOpen}
          openModal={openModal}
        />
      )}
    </Fragment>
  );
}

function MobileComponent({ openModal, isModalOpen, closeModal }) {
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

  // function deleteModal(isDelete) {


  // }

  return (
    <div className="header">
      <div className="header-top">
        <img src="img/kanban-site-logo.svg" alt="img logo" />

        <div className="header-top-bottom">
          <Dropdown />
          <img src="img/down-icon.svg" alt="" />
        </div>
      </div>

      <div className="header-down">
        <button
          className="modal-btn"
          onClick={openTaskModal}
          disabled={!currentBoard}
        >
          <img src="img/add-icon.svg" alt="" />
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
          <button onClick={() => deleteModal(true)} className="deleteBoard">
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

function DesktopComponent({ openModal, isModalOpen, closeModal }) {
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
      <div className="header-top">
        <img src="img/kanban-site-logo-white.svg" alt="img logo" />
        <img src="img/kanban-site-logo.svg" alt="img logo" />

        <div className="header-top-bottom">
          <Dropdown />
          <img src="img/down-icon.svg" alt="" />
        </div>
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



      {isEditDeleteBoard && (
        <div className="edit-delete-board">
          <button onClick={() => openModal(true)} className="editBoard">Edit Board</button>
          <button className="deleteBoard">Delete Board</button>
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

function Dropdown(e) {
  // console.log("e"{e})
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { todos, setTodos, setEdit, setCurrentBoard, setSelectedBoard } =
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
    // setSelectedBoard({ ...board, columns: board.columns || [] });
    setEdit(false);
    setCurrentBoard(board);
    console.log(board);
  }

  const currentpart = todos.find 

  return (
    <div className="dropdown" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="dropdown-btn">
         {/* {currentpart} */}
         ({ (todos.length)})
      </button>
      <ul className={`dropdownMenu ${isOpen ? "show" : ""}`}>
        {todos?.map((x) => (
          <li key={x.id}>
            <button
              className="dropdownBtn"
              onClick={() => handleSelectBoard(x)}
            >
              <img src="img/dropdown-grey-menu-icon.svg" alt="" />
              {x.name}
            </button>
          </li>
        ))}
        <div className="light-dark-mode">
          <button>
            <img src="img/white-mode-theme-icon.svg" alt="" />
          </button>
          <button>
            <img src="img/dark-mode-theme-icon.svg" alt="" />
          </button>
        </div>
      </ul>
    </div>
  );
}
