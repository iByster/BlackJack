import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { BlackJack } from '../../components/BlackJack/BlackJack';
import { Button } from '../../components/Button/Button';
import { FlexColumnContainer } from '../../components/FlexColumnContainer/FlexColumnContainer';
import { useAuthContext } from '../../context/AuthProvider';
import { useRoomContext } from '../../context/RoomProvider';
import { useSocketContext } from '../../context/SocketProvider';
import style from './Lobby.module.scss';

interface LobbyProps {}

export const Lobby: React.FC<LobbyProps> = ({}) => {
  const { userProfile, logout, setGameActive } = useAuthContext();
  // const [gameStarted, setGameStarted] = useState(false);
  const { socket, isConnected } = useSocketContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isConnected) {
      socket?.on('gameStarted', () => {
        setGameActive?.();
        navigate(`/table/${userProfile?.roomId}`);
      });
    }
  }, [socket, isConnected]);

  if (!userProfile || Object.keys(userProfile).length === 0) {
    return <Navigate to="/" replace={true} />;
  }

  const handleExit = () => {
    if (userProfile.id) {
      logout?.(userProfile.id);
    }
    navigate('/', { replace: true });
  };

  return (
    <FlexColumnContainer>
      {userProfile ? (
        <>
          <BlackJack variant="small" />
          <p className={style.info}>
            Take a sit <strong>{userProfile.name}</strong>, your game will start
            soon!
          </p>
          <p className={style.loading}>Waiting players to join...</p>
          <Button variant="big" onClick={handleExit}>
            Exit
          </Button>
        </>
      ) : (
        <>Access denied</>
      )}
    </FlexColumnContainer>
  );
};
