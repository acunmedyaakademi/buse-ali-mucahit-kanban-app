import React, { useState, useEffect, useContext } from 'react';
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
  const { isTaskModalOpen, closeTaskModal, openTaskModal, currentBoard } = useContext(TodoContext);
  return (
    <>
      <div className="header">
        <div className="header-top">
          <img src="img/kanban-site-logo.svg" alt="img logo" />

          <div className="header-top-bottom">
            <h2>Platform Launch</h2>
            <img src="img/down-icon.svg" alt="" />
          </div>
        </div>

        <div className="header-down">
          <button className="modal-btn" onClick={openTaskModal} disabled={!currentBoard}>
            <img src="img/add-icon.svg" alt="" />
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

function DesktopComponent() {
  const { isTaskModalOpen, closeTaskModal, openTaskModal, currentBoard } = useContext(TodoContext);
  return (
    <>
      <div className="header">
        <div className="header-top">
          <img src="img/kanban-site-logo-white.svg" alt="img logo" />
          <img src="img/kanban-site-logo.svg" alt="img logo" />

          <div className="header-top-bottom">
            <h2>Platform Launch</h2>
            <img src="img/down-icon.svg" alt="" />
          </div>
        </div>

        <div className="header-down">
            <button className="modal-btn" onClick={openTaskModal} disabled={!currentBoard}>
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