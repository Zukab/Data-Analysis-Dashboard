import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';

import App from './App.tsx';

import './index.css';

import { ThemeProvider } from './context/ThemeContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toaster />
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);
