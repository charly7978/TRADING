import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

// Registrar el service worker para PWA SOLO en producción
if (
  'serviceWorker' in navigator &&
  window.location.hostname !== 'localhost' &&
  window.location.protocol !== 'http:'
) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').catch(err => {
      console.error('Service Worker registration failed:', err);
    });
  });
}
