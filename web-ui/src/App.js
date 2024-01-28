// App.js

import React, { useState } from 'react';
import Login from './Login';
import UserView from './UserView';
import AdminView from './AdminView';

const App = () => {
  const [userType, setUserType] = useState('');
  const [groupCode, setGroupCode] = useState('');

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
      {userType === '' && <Login onLogin={handleLogin} />}
      {userType === 'USER' && <UserView groupCode={groupCode} />}
      {userType === 'ADMIN' && <AdminView groupCode={groupCode} />}
    </div>
  );
};

export default App;
