import React from 'react';
import ReactDOM from 'react-dom/client'; // تغییر این بخش
import App from './App';
import './assets/styles/fonts.css';
import './assets/styles/global.css';

const root = ReactDOM.createRoot(document.getElementById('root')); // این خط تغییر کرده
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
