import React from 'react';
import style from './Button.module.scss';

interface ButtonProps {
  onClick: (e: React.SyntheticEvent) => void;
  children?: React.ReactNode;
  variant?: 'small' | 'big';
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant,
}) => {
  return (
    <button onClick={onClick} className={style['button']}>
      {children}
    </button>
  );
};
