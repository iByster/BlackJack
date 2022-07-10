import React from 'react';
import useSound from 'use-sound';
import { IPlayerStats } from '../../types';
import { CardsContainer } from '../CardsContainer/CardsContainer';
import { Points } from '../Points/Points';
import style from './Slot.module.scss';
import blackJackSE from '../../sounds/blackjack2.wav';

interface SlotProps {
  playerStats: IPlayerStats;
}

export const Slot: React.FC<SlotProps> = ({ playerStats }) => {
  const [play] = useSound(blackJackSE)

  if (playerStats.totalPoints === 21) {
    play();
  }

  return (
    <div className={style.slot}>
      <p style={{ margin: 0 }}>chips: {playerStats.chips}</p>
      <Points points={playerStats.totalPoints} />
      <p>{playerStats.name}</p>
      <CardsContainer playerCards={playerStats.cards} />
    </div>
  );
};
