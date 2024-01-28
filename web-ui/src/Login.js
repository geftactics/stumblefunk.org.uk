// Login.js

import React, { useState } from 'react';
import config from './config';

const Login = ({ onLogin }) => {
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLoginApi = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ group_id: code }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.Message, code);
      } else {
        var loginErrorMessage = response.status === 403 ? data.Message : 'Login failed';
        if (loginErrorMessage === 'CLOSED') {
          loginErrorMessage = 'Accreditation is now closed'
        }
        else {
          loginErrorMessage = 'Invalid access code'
        }
        setErrorMessage(loginErrorMessage);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleKeyPress_Login = (e) => {
    if (e.key === 'Enter') {
      handleLoginApi();
    }
  };

  return (
    <div className='container'>
      <div className='text-center'>
        <img src="/SF-small.png" alt="Stumblefunk" />
        <br/><br/>
      </div>
      <div className='form-signin'>
        <h5 className='form-signin-heading' style={{ color: errorMessage ? '#ff6a58' : '#ffffff' }}>
          {errorMessage || 'Please sign in (a21d54e2)'}
        </h5>
        <input
          type="password"
          id="guid"
          className="form-control"
          placeholder="Access code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyUp={handleKeyPress_Login}
          required
          autoFocus
        />
        <br/>
        <button className="btn btn-lg btn-secondary w-100" onClick={handleLoginApi}>
          Sign in
        </button>
      </div>
    </div>
  );
};

export default Login;
