import React from 'react';
import style from './TableBorder.module.scss'

interface TableBorderProps {}

export const TableBorder: React.FC<TableBorderProps> = ({}) => {
  return (
    <>
      <div id={style.left}></div>
      <div id={style.right}></div>
      <div id={style.top}></div>
      <div id={style.bottom}></div>
    </>
  );
};
