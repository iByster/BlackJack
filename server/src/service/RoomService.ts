import { IRoom } from '../types';

class RoomService {
  setPlayersGameStatusActive(room: IRoom) {
    room.players = room.players.map((player) => ({
      ...player,
      gameActive: true,
    }));
    return room;
  }

  findRoomById(id: number, rooms: IRoom[]) {
    return rooms.find(room => room.id === id);
  }

  findUserStatsIndexById(userId: number, room: IRoom) {
    const user = room.players.find(player => player.id === userId);
    return room.tableStats.playersStats?.findIndex(ps => ps.name === user?.name);
  }
}

export default RoomService;
