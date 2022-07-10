import React, { useEffect, useState } from 'react';
import style from './Tables.module.scss';
import { Slots } from '../../components/Slots/Slots';
import { Dealer } from '../../components/Dealer/Dealer';
import { ActionBar } from '../../components/ActionBar/ActionBar';
import { ITableStats } from '../../types';
import { useSocketContext } from '../../context/SocketProvider';
import { useAuthContext } from '../../context/AuthProvider';
import { tableStatsReq } from '../../controllers/TableController';
import { TableClosedModal } from '../../components/TableClosedModal/TableClosedModal';

interface TableProps {}

export const Table: React.FC<TableProps> = ({}) => {
  const [tableStats, setTableStats] = useState<ITableStats>();
  const [userInGame, setUserInGame] = useState(false);
  console.log('TABLE STATS: ', tableStats);
  const { socket } = useSocketContext();
  const { userProfile } = useAuthContext();

  useEffect(() => {
    if (userProfile) {
      if (!tableStats) {
        if (socket) {
          socket.emit('getTableStatus', userProfile.roomId);

          socket.on('tableStats', (tableStatsPayload: ITableStats) => {
            setTableStats(tableStatsPayload);
            
            setUserInGame(
              !!tableStatsPayload.playersStats.find(
                (ps) => ps.id === userProfile.id
              )
            );
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    const initTable = async (roomId: number) => {
      const { results, errors } = await tableStatsReq(roomId);
      if (userProfile) {
        setUserInGame(
          !!results.playersStats.find(
            (ps: any) => ps.id === userProfile.id
          )
        );
      }
      setTableStats(results);
    };

    if (!tableStats) {
      if (userProfile?.roomId) {
        initTable(userProfile.roomId);
      }
    }

    socket?.on('tableStats', (tableStatsPayload) => {
      setTableStats(tableStatsPayload);
      if (userProfile) {
        setUserInGame(
          !!tableStatsPayload.playersStats.find(
            (ps: any) => ps.id === userProfile.id
          )
        );
      }
    });
  }, [tableStats, userProfile, userInGame]);

  const handlePlayerHit = () => {
    if (socket && userProfile) {
      const { roomId, id } = userProfile;
      socket.emit('hit', { roomId, userId: id });
    }
  };

  const handlePlayerStand = () => {
    if (socket && userProfile) {
      const { roomId, id } = userProfile;
      socket.emit('stand', { roomId, userId: id });
    }
  };

  const handlePlayerSurrender = () => {};

  if (tableStats) {
    return (
      <>
        {!userInGame && <TableClosedModal />}
        {/* <TableClosedModal /> */}
        <div className={style.table}>
          <Dealer dealerStats={tableStats.dealerStats} />
          <Slots playersStats={tableStats.playersStats} />
          <ActionBar
            currentUserName={userProfile?.name!}
            playersStats={tableStats.playersStats}
            handlePlayerHit={handlePlayerHit}
            handlePlayerStand={handlePlayerStand}
            handlePlayerSurrender={handlePlayerSurrender}
            message={tableStats.logs}
          />
        </div>
      </>
    );
  } else {
    return <>No game started for you</>;
  }
};
