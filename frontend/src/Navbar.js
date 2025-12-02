import React from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ userType, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-sm navbar-container flex-wrap">
      <img src="SF-small.png" alt="logo" className="navbar-brand" />
      <div className="navbar-nav ms-auto flex-row flex-wrap align-items-center gap-2">
        {userType === 'ADMIN' && (
          <>
            <button className="btn btn-secondary" onClick={() => { navigate('/accreditation/groups'); }}>
              Groups
            </button>
            <button className="btn btn-secondary" onClick={() => { navigate('/accreditation/totals'); }}>
              Totals
            </button>
            <button className="btn btn-secondary" onClick={() => { navigate('/accreditation/list/adult'); }}>
              Adults
            </button>
            <button className="btn btn-secondary" onClick={() => { navigate('/accreditation/list/child'); }}>
              Children
            </button>
            <button className="btn btn-secondary" onClick={() => { navigate('/accreditation/list/vehicle'); }}>
               Vehicles
            </button>
          </>
        )}
        <button className="btn btn-secondary" onClick={() => { navigate('/accreditation/logout'); onLogout(); }}>
          Logout
        </button>
      </div>
    </nav>

  );
};

export default Navbar;
