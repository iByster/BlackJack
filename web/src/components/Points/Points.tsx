import React from 'react';

interface PointsProps {
  points: number;
  style?: any;
}

export const Points: React.FC<PointsProps> = ({ points, style }) => {
  const wrapPoints = () => {
    if (points === 21) {
      return <strong style={{ color: 'green' }}>BLACKJACK</strong>;
    }

    if (points > 21) {
      return <strong style={{ color: 'red' }}>BUSTED</strong>;
    }

    return points;
  };
  return <p style={{ margin: 0, ...style }}>points: {wrapPoints()}</p>;
};
