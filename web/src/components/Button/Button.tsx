import React from 'react';
import style from './Button.module.scss';

interface ButtonProps {
  onClick: (e: React.SyntheticEvent) => void;
  children?: React.ReactNode;
  variant?: 'small' | 'big';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant,
  disabled
}) => {
  return (
    <button onClick={onClick} className={style[variant === 'big' ? 'button' : 'small-button']} disabled={disabled}>
      {children}
    </button>
  );
};
