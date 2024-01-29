import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login';
import UserView from './UserView';
import AdminView from './AdminView';
import Header from './Header';

const App = () => {
  const [userType, setUserType] = useState('');
  const [groupCode, setGroupCode] = useState();

  const handleLogout = () => {
    setUserType('');
    setGroupCode('');
  };

  const handleLogin = (message, code) => {
    if (message === 'USER' || message === 'ADMIN') {
      // Login success, set variables
      setUserType(message);
      setGroupCode(code);
    } else {
      // Bad login, clear variables
      setUserType('');
      setGroupCode('');
    }
  };

  return (
    <Router>
      <div>
        {userType !== '' && !window.location.pathname.includes('/logout') && <Header userType={userType} onLogout={handleLogout} />}
        <Routes>
          {!userType && <Route path="/" element={<Login onLogin={handleLogin} />} />}
          {userType === 'USER' && <Route path="/" element={<UserView groupCode={groupCode} userType={userType} />} />}
          {userType === 'ADMIN' && <Route path="/" element={<AdminView groupCode={groupCode} userType={userType} />} />}
          <Route path="/groups" element={<AdminView groupCode={groupCode} userType={userType} />} />
          <Route path="/group-edit" element={<UserView groupCode={groupCode} userType={userType} />} />
          <Route path="/logout" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
