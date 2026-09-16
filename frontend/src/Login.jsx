import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Login = ({ onLogin }) => {
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add('login');
    return () => {
      document.body.classList.remove('login');
    };
  }, []);

  const handleLoginApi = async () => {
    try {
      const response = await fetch(`${window.config.apiUrl}/login`, {
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
      navigate('/accreditation');
      handleLoginApi();
    }
  };

  return (
    <div className='login-container'>
      <div className='text-center'>
        <img src="SF-small.png" alt="Stumblefunk" />
        <br/><br/>
      </div>
      <div className='form-signin'>
        <h5 className='form-signin-heading' style={{ color: errorMessage ? '#ff6a58' : '#ffffff' }}>
          {errorMessage || 'Please sign in'}
        </h5>
        <div className="password-field">
        <input
          type={showPassword ? 'text' : 'password'}
          id="guid"
          aria-label="Access code"
          className="form-control"
          placeholder="Access code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyUp={handleKeyPress_Login}
          required
          autoFocus
        />
        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword(visible => !visible)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          aria-controls="guid"
          title={showPassword ? 'Hide password' : 'Show password'}
        >
          <i className={showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'} aria-hidden="true" />
        </button>
        </div>
        <br/>
        <button className="btn btn-lg btn-secondary w-100" onClick={() => { navigate('/accreditation'); handleLoginApi(); }}>
          Sign in
        </button>
      </div>
    </div>
  );
};

export default Login;
