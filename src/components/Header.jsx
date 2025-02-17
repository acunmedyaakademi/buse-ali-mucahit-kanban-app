import React, { useState, useEffect } from 'react';

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
            <h2>latform Launch</h2>
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
            <h2>latform Launch</h2>
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