import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './css/tokens.css';
import './index.css';
import './css/aparelho.css';
import './css/lcd.css';
import './css/tela-secundaria.css';
import './css/app.css';
import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
