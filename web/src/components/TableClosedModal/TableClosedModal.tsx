import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthProvider';
import { Button } from '../Button/Button';
import style from './TableClosedModal.module.scss';

interface TableClosedModalProps {}

export const TableClosedModal: React.FC<TableClosedModalProps> = ({}) => {
  const navigate = useNavigate();
  const { userProfile, logout } = useAuthContext();

  const handleExitGame = () => {
    if (userProfile) {
        logout?.(userProfile.id!);
      }
      navigate('/', { replace: true });
  };

  return (
    <div className={style['modal-main']}>
      <h1 className={style.title}>You LOST all your money!</h1>
      <Button onClick={handleExitGame} variant={'big'}>
        Home{' '}
      </Button>
      <h3>Get out of here...</h3>
    </div>
  );
};
