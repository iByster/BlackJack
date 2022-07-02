import React from 'react';
import style from './BlackJack.module.scss';

interface BlackJackProps {
  variant: 'big' | 'small';
}

export const BlackJack: React.FC<BlackJackProps> = ({ variant }) => {
  const textStyle =
    variant === 'small' ? 'black-jack-small-text' : 'black-jack-text';

  return <h1 className={style[textStyle]}>BLACKJACK</h1>;
};
