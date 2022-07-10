import React from 'react';
import { ICard } from '../../types';
import { Card } from '../Card/Card';
import style from './CardsContainer.module.scss';

interface CardsContainerProps {
  playerCards: ICard[];
}

export const CardsContainer: React.FC<CardsContainerProps> = ({
  playerCards,
}) => {
  return (
    <div className={style['cardsContainer']}>
      {playerCards.map((card: ICard, i) => (
        <Card card={card} key={i} />
      ))}
    </div>
  );
};
