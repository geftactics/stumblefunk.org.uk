import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap-icons/font/bootstrap-icons.css';

import './index.css';

const envApiUrl = import.meta.env.VITE_API_URL;
window.config = window.config || {};

if (envApiUrl) {
  window.config.apiUrl = envApiUrl;
} else if (!window.config.apiUrl) {
  console.warn('API URL not configured. Set VITE_API_URL or update public/config.js');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
