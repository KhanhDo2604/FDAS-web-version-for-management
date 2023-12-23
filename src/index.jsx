import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthContextProvider } from './hooks/useAuth';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
);