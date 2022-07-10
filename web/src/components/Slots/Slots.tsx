import React from 'react';
import { IPlayerStats } from '../../types';
import { CardsContainer } from '../CardsContainer/CardsContainer';
import { Slot } from '../Slot/Slot';
import style from './Slots.module.scss';

interface SlotsProps {
  playersStats: IPlayerStats[];
}

export const Slots: React.FC<SlotsProps> = ({ playersStats }) => {
  return (
    <div className={style.slots}>
      {playersStats.map((p) => (
        <Slot playerStats={p} key={p.name}/>
      ))}
    </div>
  );
};
