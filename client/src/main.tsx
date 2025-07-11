import React from 'react';
import ReactDOM from 'react-dom/client';
import "./index.css"; 
import App from './App';
import { RoomProvider } from './context/RoomContext'; // 👈 import your provider

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RoomProvider>       {/* 👈 wrap the app here */}
      <App />
    </RoomProvider>
  </React.StrictMode>
);