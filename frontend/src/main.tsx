import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error("❌ Aucun élément avec l'id 'root' n'a été trouvé dans le DOM.");
}

createRoot(container).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
