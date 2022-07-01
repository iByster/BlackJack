import { useEffect, useState } from 'react';
import './App.css';
import io from 'socket.io-client';

const socket = io('http://localhost:5446');

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('pong', () => {
      // setLastPong(new Date().toISOString());
    });
  }, []);

  return <div>App</div>;
}

export default App;
