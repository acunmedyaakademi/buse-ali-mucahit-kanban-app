import React, { useState, useEffect, useContext, useRef } from 'react';
import { TodoContext } from "./TodoContext";
import NewEditTask from './NewEditTask';

export default function MyComponent() {
  const [ismobil, setIsmobil] = useState(window.innerWidth < 600);


  useEffect(() => {
    const handleResize = () => {
      setIsmobil(window.innerWidth < 600);
    };

    window.addEventListener('resize', handleResize);

    // Temizleme işlemi: event listener'ı component unmount olduğunda kaldırıyoruz
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);



  return (
    <div>
      {ismobil ? <MobileComponent /> : <DesktopComponent />}
    </div>
  );
}


function MobileComponent() {
  const { isTaskModalOpen, closeTaskModal, openTaskModal, currentBoard, isEditDeleteBoard, setIsEditDeleteBoard } = useContext(TodoContext);

  function openIsEditDeleteBoard() {
    setIsEditDeleteBoard(!isEditDeleteBoard);
  }

  
 
  return (
    <>
      <div className="header">
        <div className="header-top">
          <img src="img/kanban-site-logo.svg" alt="img logo" />

          <div className="header-top-bottom">
            <Dropdown />
            <img src="img/down-icon.svg" alt="" />
          </div>
        </div>

        <div className="header-down">
          <button className="modal-btn" onClick={openTaskModal} disabled={!currentBoard}>
            <img src="img/add-icon.svg" alt="" />
          </button>
          <img onClick={openIsEditDeleteBoard} src="img/detail-icon.svg" alt="" />
        </div>

      </div>
      {
        isEditDeleteBoard && (
          <div className='edit-delete-board'>
            <button onClick={location.hash ="/new-edit-board"} className='editBoard'>Edit Board</button>
            <button className='deleteBoard'>Delete Board</button>
          </div>
        )
      }

      {isTaskModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={closeTaskModal}>✖</button>
            <NewEditTask closeModal={closeTaskModal} />
          </div>
        </div>
      )}
    </>
  )
}

function DesktopComponent() {
  const { isTaskModalOpen, closeTaskModal, openTaskModal, currentBoard } = useContext(TodoContext);
  return (
    <>
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
          <button className="headerAddTaskBtn" onClick={openTaskModal} disabled={!currentBoard}>
            + Add New Task
          </button>
          <img src="img/detail-icon.svg" alt="" />
        </div>
      </div>

      {isTaskModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-btn" onClick={closeTaskModal}>✖</button>
            <NewEditTask closeModal={closeTaskModal} />
          </div>
        </div>
      )}
    </>
  )
}

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { todos, setTodos, setEdit, setCurrentBoard } = useContext(TodoContext);

  // menü dısına tıklanınca
  useEffect(() => {
    function handleClickOutside() {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    }

  }, [])


  function handleSelectBoard(board) {
    setSelectedBoard({ ...board, columns: board.columns || [] });
    setEdit(false);
    setCurrentBoard(board);
  }


  return (
    <div className="dropdown" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="dropdown-btn">
        ALL BOARDS ({todos.length})
      </button>
      <ul className={`dropdownMenu ${isOpen ? "show" : ""}`}>
        {todos?.map((x) => (
          <li key={x.id}>
            <button className='dropdownBtn' onClick={() => handleSelectBoard(x)}><img src="img/dropdown-grey-menu-icon.svg" alt="" />{x.name}</button>
          </li>
        ))}
      </ul>
    </div>
  )
}



