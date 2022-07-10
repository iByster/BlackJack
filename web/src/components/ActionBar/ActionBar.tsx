import React, { useEffect, useState } from 'react';
import { IPlayerStats } from '../../types';
import { Button } from '../Button/Button';
import style from './ActionBar.module.scss';

interface ActionBarProps {
  handlePlayerHit(): void;
  handlePlayerStand(): void;
  handlePlayerSurrender(): void;
  handlePlayerSplit?(): void;
  handlePlayerDouble?(): void;
  playersStats: IPlayerStats[];
  currentUserName: string;
  message?: string;
}

export const ActionBar: React.FC<ActionBarProps> = ({
  handlePlayerHit,
  handlePlayerStand,
  handlePlayerSurrender,
  playersStats,
  currentUserName,
  message,
}) => {
  const [turn, setTurn] = useState<Partial<IPlayerStats>>({});

  useEffect(() => {
    playersStats.forEach((ps) => {
      if (ps.turn) {
        setTurn(ps);
      }
    });
  }, [turn, playersStats]);

  const actionBarBody = () => {
    if (message) {
      return <p className={style.loading}><strong>{message}</strong></p>;
    } else {
      if (turn.name === currentUserName) {
        
        return (
          <>
            <Button onClick={handlePlayerStand}>Stand</Button>
            <Button onClick={handlePlayerHit} disabled={turn.totalPoints === 21}>Hit</Button>
            <Button onClick={handlePlayerSurrender}>Surrender</Button>
            {/* <Button onClick={() => {}}>Split</Button>
            <Button onClick={() => {}}>Double</Button> */}
          </>
        );
      } else {
        return <p><strong>It's {turn.name}'s turn now!</strong></p>;
      }
    }
  };

  return <div className={style['action-bar']}>{actionBarBody()}</div>;
};
