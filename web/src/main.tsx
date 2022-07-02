import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './context/AuthProvider';
import { TableBorder } from './components/TableBorder/TableBorder';
import { SocketProvider } from './context/SocketProvider';
import { RoomProvider } from './context/RoomProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <SocketProvider>
    <React.StrictMode>
      <RoomProvider>
        <AuthContextProvider>
          <BrowserRouter>
            <TableBorder />
            <App />
          </BrowserRouter>
        </AuthContextProvider>
      </RoomProvider>
    </React.StrictMode>
  </SocketProvider>
);
