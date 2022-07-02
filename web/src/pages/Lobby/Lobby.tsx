import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BlackJack } from '../../components/BlackJack/BlackJack';
import { Button } from '../../components/Button/Button';
import { FlexColumnContainer } from '../../components/FlexColumnContainer/FlexColumnContainer';
import { useAuthContext } from '../../context/AuthProvider';
import { useRoomContext } from '../../context/RoomProvider';
import { useSocketContext } from '../../context/SocketProvider';
import style from './Lobby.module.scss';

interface LobbyProps {}

export const Lobby: React.FC<LobbyProps> = ({}) => {
  const { userProfile, logout } = useAuthContext();
  const { socket } = useSocketContext();

  let navigate = useNavigate();

  if (!userProfile || Object.keys(userProfile).length === 0) {
    navigate('/');
  }

  const handleExit = () => {
    logout?.();
    navigate('/');
  }

  return userProfile ? (
    <FlexColumnContainer>
      <BlackJack variant="small" />
      <p className={style.info}>Take a sit <strong>{userProfile.name}</strong>, your game will start soon!</p>
      <p className={style.loading}>Waiting players to join...</p>
      <Button onClick={handleExit}>Exit</Button>
    </FlexColumnContainer>
  ) : (
    <>Please sign up!</>
  );
};
