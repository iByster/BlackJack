import './App.css';
import { WelcomePage } from './pages/WelcomePage/WelcomePage';
import { Routes, Route } from 'react-router-dom';
import { Lobby } from './pages/Lobby/Lobby';
import { NotFound } from './pages/NotFound/NotFound';
import { Table } from './pages/Table/Table';
import { userIsAuth } from './utils/userIsAuth';
import { useEffect } from 'react';
import { useAuthContext } from './context/AuthProvider';

function App() {
  const { login } = useAuthContext();
  useEffect(() => {
    const fn = async () => {
      const me = await userIsAuth();
      login?.(me);
    }

    fn();
  }, []);

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
