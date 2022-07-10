import React, { FC, useEffect, useState } from 'react';
import { IUserProfile, useAuthContext } from '../context/AuthProvider';
import { me } from '../controllers/UserController';
import { Navigate } from 'react-router-dom';

type UserStatus = 'in-lobby' | 'in-game';

export const UserIsAuth: React.FC = ({}) => {
  const { login } = useAuthContext();
  const [status, setStatus] = useState<UserStatus>();

  useEffect(() => {
    const fn = async () => {
      const userJSON = localStorage.getItem('user');

      if (userJSON) {
        const user: IUserProfile = JSON.parse(userJSON);
        const { results, errors } = await me(user.id);

        if (errors) {
          console.log(errors);
          return;
        }

        login?.(results);

        if (results.activeGame) {
          setStatus('in-game');
        } else {
          setStatus('in-lobby');
        }
      }
    };

    fn();
  }, [login, status]);

  if (status === 'in-game') {
    return <Navigate to="/table" replace={true} />
  } else {
    return <Navigate to="/lobby" replace={true} />
  }
};
