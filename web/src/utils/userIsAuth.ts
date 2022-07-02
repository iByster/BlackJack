import React, { FC } from 'react';
import { IUserProfile, useAuthContext } from '../context/AuthProvider';
import { me } from '../controllers/UserController';

export const UserIsAuth: React.FC = () => {


  const userJSON = localStorage.getItem('user');

  if (userJSON) {
    const user: IUserProfile = JSON.parse(userJSON);
    console.log(user.id);
    const { results, errors } = await me(user.id);

    if (errors) {
      console.log(errors);
      return;
    }

    return results;
  }

  return;
};
