import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import { Lobby } from './pages/Lobby/Lobby';
import { NotFound } from './pages/NotFound/NotFound';
import { Table } from './pages/Table/Table';
import { WelcomePage } from './pages/WelcomePage/WelcomePage';
import { me } from './controllers/UserController';
import { IUserProfile, useAuthContext } from './context/AuthProvider';
import { useSocketContext } from './context/SocketProvider';

function App() {
  const { login, userProfile } = useAuthContext();
  const navigate = useNavigate();
  const { socket } = useSocketContext();

  useEffect(() => {
    const initUserSession = async () => {
      const userProfileSession = localStorage.getItem('user');
      if (userProfileSession) {
        const userProfileJson = JSON.parse(userProfileSession);

        const { results: user, errors } = await me(userProfileJson.id);
        login?.(user);
        if (user.gameActive) {
          navigate(`/table/${user.roomId}`, { replace: true });
          socket?.emit('rejoinRoom', {
            userId: userProfileJson.id,
            roomId: userProfileJson.roomId,
          });
        }
      } else {
        console.log('NO SESSION');
      }
    };

    if (!userProfile) {
      initUserSession();
    }
  }, [userProfile]);

  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="lobby" element={<Lobby />} />
      <Route path="table/:id" element={<Table />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
