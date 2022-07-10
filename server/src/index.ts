import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { CHIPS_VALUE, ROOM_MAX_PLAYERS } from './consts';
import RoomService from './service/RoomService';
import UserService from './service/UserService';
import {
  IPlayerActionPayload,
  IPlayerStats,
  IRegisterPayload,
  IRoom,
  IUser,
} from './types';
import { delay } from './utils/delay';
import { generateDecks } from './utils/generateDecks';
import { canculatePointByCards, dealersShuffle } from './utils/shuffle';
import 'dotenv/config';

// TODO .env
const PORT = process.env.PORT;

let usersConnected: IUser[] = [];
let clientId = 0;
let roomId: number;
let rooms: IRoom[] = [];
const roomService = new RoomService();
const userService = new UserService();

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

server.listen(PORT, () => {
  console.log(`SERVER STARTED ON PORT: ${PORT}`);
});

const logout = (id: number) => {
  const indexOfUser = usersConnected.findIndex((user) => user.id === id);
  const indexOfRoom = rooms.findIndex(
    (room) => room.id === usersConnected[indexOfUser].roomId
  );
  const indexOfUserInRoom = rooms[indexOfRoom].players.findIndex(
    (player) => player.id === id
  );
  const indexOfUserInPlayerStats = rooms[
    indexOfRoom
  ].tableStats.playersStats!.findIndex((player) => player.id === id);
  usersConnected.splice(indexOfUser, 1);
  rooms[indexOfRoom].players.splice(indexOfUserInRoom, 1);
  rooms[indexOfRoom].tableStats.playersStats!.splice(
    indexOfUserInPlayerStats,
    1
  );
};

const checkingForWinners = async (room: IRoom) => {
  room.tableStats.logs = 'Handling winners or losers...';
  io.to(roomId.toString()).emit('tableStats', room.tableStats);

  await delay(1000);

  room.tableStats.playersStats!.forEach((ps) => {
    if (ps.totalPoints > 21) {
      return;
    }
    if (ps.totalPoints === 21) {
      ps.chips += CHIPS_VALUE * 2 + 50;
      return;
    }
    if (
      (ps.totalPoints > room.tableStats.dealerStats!.totalPoints &&
        !(ps.totalPoints > 21)) ||
      room.tableStats.dealerStats!.totalPoints > 21
    ) {
      ps.chips += CHIPS_VALUE * 2;
      return;
    }
    if (ps.totalPoints === room.tableStats.dealerStats!.totalPoints) {
      ps.chips += CHIPS_VALUE;
      return;
    }
  });

  io.to(roomId.toString()).emit('tableStats', room.tableStats);
};

const dealersTurn = async (room: IRoom) => {
  room.tableStats.logs = "It's Dealer's turn...";
  io.to(roomId.toString()).emit('tableStats', room.tableStats);

  await delay(2000);

  room.tableStats.dealerStats?.cards.push(room.deck.shift()!);
  room.tableStats.dealerStats!.totalPoints = canculatePointByCards(
    room.tableStats.dealerStats?.cards!
  );
  io.to(roomId.toString()).emit('tableStats', room.tableStats);

  await delay(1500);

  if (room.tableStats.dealerStats!.totalPoints < 16) {
    room.tableStats.dealerStats?.cards.push(room.deck.shift()!);

    room.tableStats.dealerStats!.totalPoints = canculatePointByCards(
      room.tableStats.dealerStats?.cards!
    );
  }

  await delay(1500);

  io.to(roomId.toString()).emit('tableStats', room.tableStats);
};

const newRound = async (
  roomIndex: number,
  playersStatsParam?: IPlayerStats[]
) => {
  rooms[roomIndex].deck = dealersShuffle(generateDecks());

  if (playersStatsParam) {
    const usersOutIds: number[] = [];

    playersStatsParam.forEach((ps, i) => {
      // if (ps.chi)
      if (i == 0) {
        ps.turn = true;
      } else {
        ps.turn = false;
      }

      if (ps.chips <= 0) {
        usersOutIds.push(ps.id);
      }

      ps.cards = [];
    });

    userService.setUserConnectGameStatusDisconnected(
      usersConnected,
      usersOutIds
    );
    playersStatsParam = playersStatsParam.filter((ps) => ps.chips > 0);

    playersStatsParam.forEach((ps, i) => {
      if (i == 0) {
        ps.turn = true;
      } else {
        ps.turn = false;
      }
    });
  }

  rooms[roomIndex].tableStats = {
    dealerStats: {
      cards: [],
      bet: 0,
      totalPoints: 0,
    },
    playersStats:
      playersStatsParam ||
      rooms[roomIndex].players.map((p, i) => ({
        id: p.id!,
        name: p.name!,
        cards: [],
        chips: CHIPS_VALUE * 2,
        turn: i === 0 ? true : false,
        totalPoints: 0,
      })),
    logs: playersStatsParam
      ? 'Starting the next round...'
      : 'Starting the round...',
  };

  io.to(roomId.toString()).emit('tableStats', rooms[roomIndex].tableStats);

  await delay(3000);

  // ! PLACE BET
  rooms[roomIndex].tableStats.dealerStats!.bet =
    rooms[roomIndex].tableStats.playersStats!.length * CHIPS_VALUE;
  rooms[roomIndex].tableStats.playersStats?.forEach((ps) => {
    ps.chips = ps.chips - CHIPS_VALUE;
  });

  rooms[roomIndex].tableStats.logs = 'Placing bets...';
  io.to(roomId.toString()).emit('tableStats', rooms[roomIndex].tableStats);

  await delay(1500);

  rooms[roomIndex].tableStats.logs = 'Dealing cards...';

  for (let i = 0; i < 2; ++i) {
    for (let j = 0; j < rooms[roomIndex].tableStats.playersStats!.length; ++j) {
      rooms[roomIndex].tableStats.playersStats![j].cards.push(
        rooms[roomIndex].deck.shift()!
      );

      rooms[roomIndex].tableStats.playersStats![j].totalPoints =
        canculatePointByCards(
          rooms[roomIndex].tableStats.playersStats![j].cards
        );
      await delay(1000);
      io.to(roomId.toString()).emit('tableStats', rooms[roomIndex].tableStats);
    }

    if (i == 0) {
      rooms[roomIndex].tableStats.dealerStats!.cards.push(
        rooms[roomIndex].deck.shift()!
      );
      rooms[roomIndex].tableStats.dealerStats!.totalPoints =
        canculatePointByCards(rooms[roomIndex].tableStats.dealerStats!.cards);

      await delay(1000);
      io.to(roomId.toString()).emit('tableStats', rooms[roomIndex].tableStats);
    }
  }

  rooms[roomIndex].tableStats.logs = '';
  io.to(roomId.toString()).emit('tableStats', rooms[roomIndex].tableStats);
};

io.on('connection', (socket) => {
  socket.on('rejoinRoom', (data: IPlayerActionPayload) => {
    const { userId } = data;

    const user = userService.findUserById(userId, usersConnected);

    if (user?.roomId) {
      socket.join(user.roomId.toString());
    } else {
    }
  });

  socket.on('register', async (data: IRegisterPayload) => {
    // !! SAVING USER
    const user: IUser = {};
    user.gameActive = false;
    user.name = data.name;
    user.id = clientId++;
    roomId = Math.round(clientId / 2);
    user.roomId = roomId;

    socket.join(roomId.toString());
    console.log(`New client no.: ${clientId}, room no.: ${roomId}`);

    socket.emit('userSaved', user);
    usersConnected.push(user);

    const roomIndex = rooms.findIndex((r) => r.id === roomId);

    if (roomIndex >= 0) {
      rooms[roomIndex].players.push(user);
      // !! GAME FOUND
      if (rooms[roomIndex].players.length === ROOM_MAX_PLAYERS) {
        rooms[roomIndex] = roomService.setPlayersGameStatusActive(
          rooms[roomIndex]
        );
        const roomPlayersIds = rooms[roomIndex].players.map((p) => p.id!);
        usersConnected = userService.setUserConnectGameStatusActive(
          usersConnected,
          roomPlayersIds
        );
        rooms[roomIndex].gameActive = true;

        await delay(2000);

        io.to(roomId.toString()).emit('gameStarted', {});

        await newRound(roomIndex);
      }
    } else {
      rooms.push({
        id: roomId,
        players: [user],
        tableStats: {},
        gameActive: false,
        deck: [],
        roundNumber: 0,
      });
    }
  });

  socket.on('getTableStatus', (roomId) => {
    const room = roomService.findRoomById(roomId, rooms);

    if (room && room.gameActive) {
      io.to(roomId.toString()).emit('tableStats', room.tableStats);
    }
  });

  socket.on('hit', async (data: IPlayerActionPayload) => {
    const { roomId, userId } = data;

    const room = roomService.findRoomById(roomId, rooms);

    // ! CHECK FOR ROOM
    if (room && room.gameActive) {
      let playerStatsIndex = roomService.findUserStatsIndexById(userId, room);

      // !! CHECK IF Players turn
      if (room.tableStats.playersStats) {
        if (
          playerStatsIndex !== undefined &&
          room.tableStats.playersStats[playerStatsIndex].turn
        ) {
          // ! HIT
          room.tableStats.playersStats[playerStatsIndex].cards.push(
            room.deck.shift()!
          );
          room.tableStats.playersStats![playerStatsIndex].totalPoints =
            canculatePointByCards(
              room.tableStats.playersStats![playerStatsIndex].cards
            );

          io.to(roomId.toString()).emit('tableStats', room.tableStats);

          // ! BUST OR BLACKJACK
          if (
            room.tableStats.playersStats![playerStatsIndex].totalPoints >= 21
          ) {
            room.tableStats.playersStats[playerStatsIndex].turn = false;
            io.to(roomId.toString()).emit('tableStats', room.tableStats);

            playerStatsIndex++;

            // !! DEALER'S TURN
            if (room.tableStats.playersStats.length <= playerStatsIndex) {
              await dealersTurn(room);

              await delay(3500);

              // !! CHECK FOR WINNEr
              await checkingForWinners(room);

              await delay(8000);

              await newRound(
                roomService.findRoomIndexById(roomId, rooms),
                room.tableStats.playersStats
              );
              return;
            } else {
              // !! FIND NEXT PLAYER'S TURN
              room.tableStats.playersStats[playerStatsIndex].turn = true;
            }
          }
          io.to(roomId.toString()).emit('tableStats', room.tableStats);
        } else {
          console.log('ITS NOT YOUR TURN!!!');
        }
      }
    }
  });

  socket.on('stand', async (data: IPlayerActionPayload) => {
    const { roomId, userId } = data;

    const room = roomService.findRoomById(roomId, rooms);

    if (room && room.gameActive) {
      let playerStatsIndex = roomService.findUserStatsIndexById(userId, room);
      if (room.tableStats.playersStats) {
        if (
          playerStatsIndex !== undefined &&
          room.tableStats.playersStats[playerStatsIndex].turn
        ) {
          room.tableStats.playersStats[playerStatsIndex].turn = false;
          io.to(roomId.toString()).emit('tableStats', room.tableStats);
          // get next player
          playerStatsIndex++;

          if (room.tableStats.playersStats.length <= playerStatsIndex) {
            await dealersTurn(room);

            await delay(3500);

            // !! CHECK FOR WINNEr
            await checkingForWinners(room);

            await delay(8000);

            await newRound(
              roomService.findRoomIndexById(roomId, rooms),
              room.tableStats.playersStats
            );
            return;
          } else {
            room.tableStats.playersStats[playerStatsIndex].turn = true;
          }
          io.to(roomId.toString()).emit('tableStats', room.tableStats);
        } else {
          console.log('ITS NOT YOUR TURN!!!');
        }
      }
    }
  });
});

io.on('disconnect', () => {
  console.log('Bye');
});

app.get('/me/:id', (req, res) => {
  const { id } = req.params;
  const user = usersConnected.find((user) => user.id === parseInt(id));
  res.send(user);
});

app.get('/table/:id', (req, res) => {
  const { id } = req.params;
  const tableStats = roomService.findRoomById(parseInt(id), rooms)?.tableStats;
  res.send(tableStats);
});

app.delete('/logout/:id', (req, res) => {
  const { id } = req.params;
  const roomId = userService.findUserById(parseInt(id), usersConnected)?.roomId;
  if (roomId) {
    const roomGameActive = roomService.findRoomById(roomId, rooms)?.gameActive;
    if (!roomGameActive) {
      clientId--;
    }
  }
  logout(parseInt(id));
  console.log('ROOMS: ', rooms);
  console.log('CONNECTED USER: ', usersConnected);
  res.send({ id });
});
