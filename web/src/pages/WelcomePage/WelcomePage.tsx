import React from 'react';
import { BlackJack } from '../../components/BlackJack/BlackJack';
import { FlexColumnContainer } from '../../components/FlexColumnContainer/FlexColumnContainer';
import { RegisterForm } from '../../components/RegisterForm/RegisterForm';
import style from './WelcomePage.module.scss';

interface WelcomePageProps {}

export const WelcomePage: React.FC<WelcomePageProps> = ({}) => {
  return (
    <FlexColumnContainer>
      <h2 className={style['welcome-text']}>Welcome To</h2>
      <BlackJack variant="big" />
      <h2>Feeling lucky today?</h2>
      <RegisterForm />
    </FlexColumnContainer>
  );
};
