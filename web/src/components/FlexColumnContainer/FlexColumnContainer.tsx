import React from 'react';
import style from './FlexColumnContainer.module.scss';

interface FlexColumnContainerProps {
  children: React.ReactNode;
}

export const FlexColumnContainer: React.FC<FlexColumnContainerProps> = ({
  children,
}) => {
  return <div className={style.container}>{children}</div>;
};
