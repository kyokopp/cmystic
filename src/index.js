import React from 'react';
import { createRoot } from 'react-dom/client'; // Nova API do React 18
import App from './App';
import './styles/global.css';

// Crie uma raiz para renderizar o aplicativo
const root = createRoot(document.getElementById('root'));

// Renderize o aplicativo usando a nova API
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);