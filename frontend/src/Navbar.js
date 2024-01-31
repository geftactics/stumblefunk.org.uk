import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ userType, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-sm navbar-container">
      <img src="SF-small.png" alt="logo" />
      <div className="navbar-collapse justify-content-end">
        <ul className="navbar-nav">
          {userType === 'ADMIN' && (
            <>
              <li className="nav-item">
                <button className="btn btn-secondary" onClick={() => { navigate('/accreditation/groups'); }}>
                  Groups
                </button>
              </li>
              <li className="nav-item">
                <button className="btn btn-secondary" onClick={() => { navigate('/accreditation/totals'); }}>
                  Totals
                </button>
              </li>
              <li className="nav-item">
                <button className="btn btn-secondary" onClick={() => { navigate('/accreditation/list/adult'); }}>
                  Adults
                </button>
              </li>
              <li className="nav-item">
                <button className="btn btn-secondary" onClick={() => { navigate('/accreditation/list/child'); }}>
                  Children
                </button>
              </li>
              <li className="nav-item">
                <button className="btn btn-secondary" onClick={() => { navigate('/accreditation/list/vehicle'); }}>
                   Vehicles
                </button>
              </li>
            </>
          )}
          <li className="nav-item">
            <button className="btn btn-secondary" onClick={() => { navigate('/accreditation/logout'); onLogout(); }}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>

  );
};

export default Navbar;
