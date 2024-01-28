// Navbar.js
import React from 'react';

const Navbar = ({ userType, onLogout }) => {
  return (
    <nav className="navbar navbar-expand-sm navbar-container">
      <img src="/SF-small.png" alt="logo" />
      <div className="navbar-collapse justify-content-end">
        <ul className="navbar-nav">
          {userType === 'ADMIN' && (
            <>
              <li className="nav-item">
                <button className="btn btn-secondary" onClick={() => console.log('Option 1')}>
                  Groups
                </button>
              </li>
              <li className="nav-item">
                <button className="btn btn-secondary" onClick={() => console.log('Option 2')}>
                  Totals
                </button>
              </li>
              <li className="nav-item">
                <button className="btn btn-secondary" onClick={() => console.log('Option 3')}>
                  Ticket List
                </button>
              </li>
              <li className="nav-item">
                <button className="btn btn-secondary" onClick={() => console.log('Option 4')}>
                  Vehicle List
                </button>
              </li>
            </>
          )}
          <li className="nav-item">
            <button className="btn btn-secondary" onClick={onLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>

  );
};

export default Navbar;
