// App.js

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './Login';
import UserView from './UserView';
import AdminView from './AdminView';
import Header from './Header';

const App = () => {
  const [userType, setUserType] = useState('');
  const [groupCode, setGroupCode] = useState('');

  const handleLogout = () => {
    setUserType('');
    setGroupCode('');
  };

  const handleLogin = (message, code) => {
    if (message === 'USER' || message === 'ADMIN') {
      setUserType(message);
      setGroupCode(code);
    } else {
      setUserType('');
      setGroupCode('');
    }
  };


  return (
    <div>
      {userType != '' && <Header userType={userType} onLogout={handleLogout} />}
      {userType === '' && <Login onLogin={handleLogin} />}
      {userType === 'USER' && <UserView groupCode={groupCode} userType={userType} />}
      {userType === 'ADMIN' && <AdminView groupCode={groupCode} userType={userType} />}
    </div>
  );
};

export default App;
