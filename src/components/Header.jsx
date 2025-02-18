import React, { useState, useEffect, useRef } from 'react';

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
          <a href="#/new-edit-task">
            <img src="img/add-icon.svg" alt="" />
          </a>
          <img src="img/detail-icon.svg" alt="" />
        </div>
      </div>
    </>
  )
}

function DesktopComponent() {
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
          <a href="#/new-edit-task">
            + Add New Task
          </a>
          <img src="img/detail-icon.svg" alt="" />
        </div>
      </div>
    </>
  )
}

function Dropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

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


  return (
    <div className="dropdown" ref={dropdownRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="dropdown-btn">
      ALL BOARDS (3)
      </button>
      <div className={`dropdownMenu ${isOpen ? "show" : ""}`}>
        <a href="#">
          <img src="img/dropdown-white-menu-icon.svg" alt="" /> Platform Launch</a>
        <a href="#">
          <img src="img/dropdown-white-menu-icon.svg" alt="" /> Marketing Plan</a>
        <a href="#">
          <img src="img/dropdown-white-menu-icon.svg" alt="" /> Roadmap</a>
        <a href="#">
          <img src="img/dropdown-white-menu-icon.svg" alt="" /> + Create New Board</a>
      </div>
    </div>
  )
}