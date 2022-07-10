import React, { useEffect, useState } from 'react';
import { ICard } from '../../types';
import style from './Card.module.scss';
import cardFlipSE from '../../sounds/card-flip.mp3';
import useSound from 'use-sound';

interface CardProps {
  card?: ICard;
  cardBack?: boolean;
}

export const Card: React.FC<CardProps> = ({ card, cardBack }) => {
  const [cardImg, setCardImg] = useState<typeof import('*.svg')>();
  const [play, { stop }] = useSound(cardFlipSE, {
    volume: 0.4,
  });

  useEffect(() => {
    const initCardImage = async () => {
      if (!cardImg) {
        if (cardBack) {
          const imgURL = await import(`../../images/deck/red2.svg`);
          setCardImg(imgURL.default);
        } else {
          if (card) {
            const imgURL = await import(
              `../../images/deck/${card.suit}_${card.value}.svg`
            );
            play();

            setTimeout(() => {
              stop();
            }, 1000);

            setCardImg(imgURL.default);

          }
        }
      }
    };

    initCardImage();
  }, [cardImg, play, stop]);

  return (
    <div className={style.cardWrapper}>
      <div className={style.card}>
        <img src={cardImg} className={style.cardImage} />
      </div>
    </div>
  );
};
