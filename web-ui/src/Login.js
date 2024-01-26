// Login.js

import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [code, setCode] = useState('');

  const handleLogin = async () => {
    try {
      const response = await fetch('https://nf2c6o0vt2.execute-api.eu-west-1.amazonaws.com/dev/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ group_id: code }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.Message, code); // Use data.Message as the message
      } else {
        const errorMessage = response.status === 403 ? data.Message : 'Login failed';
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div>
      <h2>Login</h2> 
      <label>
        Group Code:
        <input type="text" value={code} onChange={(e) => setCode(e.target.value)} />
      </label>
      <button onClick={handleLogin}>Login</button>
      <p>a21d54e2</p>
    </div>
  );
};

export default Login;
