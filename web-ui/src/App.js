// App.js

import React, { useState } from 'react';
import Login from './Login';
import UserView from './UserView';
import AdminView from './AdminView';

const App = () => {
  const [userType, setUserType] = useState('');
  const [groupCode, setGroupCode] = useState('');

  const handleLogin = (message, code) => {
    if (message) {
      setUserType(message.toLowerCase());
      setGroupCode(code);
    } else {
      console.error('Invalid message received during login');
    }
  };

  return (
    <div>
      {userType === '' ? (
        <Login onLogin={handleLogin} />
      ) : userType.toLowerCase() === 'user' ? (
        <UserView groupCode={groupCode} />
      ) : userType.toLowerCase() === 'admin' ? (
        <AdminView groupCode={groupCode} />
      ) : (
        <p>Invalid user type</p>
      )}
    </div>
  );
};

export default App;
