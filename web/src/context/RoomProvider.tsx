import React, { createContext, useContext, useEffect, useState } from 'react';

interface IRoomContext {
    roomId: number;
    setRoomId?: React.Dispatch<React.SetStateAction<number>>
}

const defaultValue = { roomId: -1 };

export const RoomContext = createContext<IRoomContext>(defaultValue);

export function useRoomContext() {
  return useContext(RoomContext);
}

interface RoomProviderProps {
  children: React.ReactNode;
}

export const RoomProvider: React.FC<RoomProviderProps> = ({ children }) => {
  const [roomId, setRoomId] = useState(-1);

  return (
    <RoomContext.Provider value={{roomId, setRoomId}}>{children}</RoomContext.Provider>
  );
};
