import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthProvider';
import { useSocketContext } from '../../context/SocketProvider';
import { Button } from '../Button/Button';
import style from './RegisterForm.module.scss';

interface RegisterFormProps {}

export const RegisterForm: React.FC<RegisterFormProps> = ({}) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  let navigate = useNavigate();
  const { login } = useAuthContext();
  const { socket } = useSocketContext();

  function handleInputChange(e: React.FormEvent<HTMLInputElement>) {
    setName(e.currentTarget.value);
  }

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (name.length < 4) {
      alert('Please enter a name with at least 4 characters');
      return;
    }

    if (socket) {
      socket.emit('register', { name });
      socket.on('userSaved', (user) => {
        login?.(user);
        navigate('/lobby');
      })
    }
  }

  return (
    <form className={style['register-form']}>
      <p>
        <input
          onChange={handleInputChange}
          className={style['input-name']}
          id="input-name"
          type="text"
          placeholder="Enter your name"
          value={name}
        />
      </p>
      <Button variant='big' onClick={handleSubmit}>PLAY</Button>
    </form>
  );
};
