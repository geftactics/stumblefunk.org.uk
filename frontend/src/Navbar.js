import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ userType, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-sm navbar-container">
      <img src="/SF-small.png" alt="logo" />
      <div className="navbar-collapse justify-content-end">
        <ul className="navbar-nav">
          {userType === 'ADMIN' && (
            <>
              <li className="nav-item">
                <button className="btn btn-secondary" onClick={() => { navigate('/groups'); }}>
                  Groups
                </button>
              </li>
              <li className="nav-item">
                <button className="btn btn-secondary" onClick={() => { navigate('/totals'); }}>
                  Totals
                </button>
              </li>
              <li className="nav-item">
                <button className="btn btn-secondary" onClick={() => { navigate('/list/adult'); }}>
                  Adults
                </button>
              </li>
              <li className="nav-item">
                <button className="btn btn-secondary" onClick={() => { navigate('/list/child'); }}>
                  Children
                </button>
              </li>
              <li className="nav-item">
                <button className="btn btn-secondary" onClick={() => { navigate('/list/vehicle'); }}>
                   Vehicles
                </button>
              </li>
            </>
          )}
          <li className="nav-item">
            <button className="btn btn-secondary" onClick={() => { navigate('/logout'); onLogout(); }}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>

  );
};

export default Navbar;
