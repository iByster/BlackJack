import React from 'react';
import style from './Dealer.module.scss';
import dealerImage from '../../images/dealer.png';
import { IDealerStats } from '../../types';
import cardBack from '../../images/deck/red2.svg';
import { Card } from '../Card/Card';
import { Points } from '../Points/Points';

interface DealerProps {
  dealerStats: IDealerStats;
}

export const Dealer: React.FC<DealerProps> = ({ dealerStats }) => {
  return (
    <div className={style['dealer-container']}>
      <div className={style.bet}>Bet: {dealerStats.bet}</div>
      <div className={style.dealer}>
        <h1 className={style['dealer-header']}>Dealer</h1>
        <img className={style['dealer-img']} src={dealerImage} />
      </div>
      <div className={style['dealer-slot']}>
        <div className={style.dealerCards}>
          {dealerStats.cards.length === 1 && <Card cardBack />}
          {dealerStats.cards.map((card, i) => (
            <Card card={card} key={i} />
          ))}
        </div>
        <Points
          points={dealerStats.totalPoints}
          style={{ textAlign: 'center' }}
        />
      </div>
    </div>
  );
};
