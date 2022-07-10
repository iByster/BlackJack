import React from 'react';
import { IPlayerStats } from '../../types';
import { CardsContainer } from '../CardsContainer/CardsContainer';
import { Points } from '../Points/Points';
import style from './Slot.module.scss';

interface SlotProps {
  playerStats: IPlayerStats;
}

export const Slot: React.FC<SlotProps> = ({ playerStats }) => {
  return (
    <div className={style.slot}>
      <p style={{ margin: 0 }}>chips: {playerStats.chips}</p>
      <Points points={playerStats.totalPoints} />
      <p>{playerStats.name}</p>
      <CardsContainer playerCards={playerStats.cards} />
    </div>
  );
};
