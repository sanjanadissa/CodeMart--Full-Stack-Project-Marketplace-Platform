import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { GoogleOAuthProvider } from "@react-oauth/google";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="732606690978-h5c4rmj2tojdg2s51hfa82ve93l7v2tg.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
  </StrictMode>
);