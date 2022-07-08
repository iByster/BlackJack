import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';
import {
  canculatePointByCards,
  dealersShuffle,
  riffleShuffle,
  spliceShuffle,
  stackShuffle,
} from './utils/shuffle';
import { delay } from './utils/delay';
import {
  ICard,
  IPlayerActionPayload,
  IRegisterPayload,
  IRoom,
  ITableStats,
  IUser,
} from './types';
import RoomService from './service/RoomService';
import UserService from './service/UserService';
import { generateDecks } from './utils/generateDecks';
import { ROOM_MAX_PLAYERS } from './consts';

// TODO .env
const PORT = 3457;

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE'],
  },
});

server.listen(PORT, () => {
  console.log(`SERVER STARTED ON PORT: ${PORT}`);
});

let usersConnected: IUser[] = [];
let clientId = 0;
let roomId: number;
let rooms: IRoom[] = [];
const roomService = new RoomService();
const userService = new UserService();

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('rejoinRoom', (data: IPlayerActionPayload) => {
    const { roomId, userId } = data;

    const user = userService.findUserById(userId, usersConnected);

    if (user?.roomId) {
      console.log('REJOIIIIIIIIIIIIIN');
      socket.join(user.roomId.toString());
    } else {
      console.log('USER NOT CONNECTED');
    }
  });

  socket.on('register', async (data: IRegisterPayload) => {
    const user: IUser = {};
    user.gameActive = false;
    user.name = data.name;
    user.id = clientId++;

    roomId = Math.round(clientId / 2);
    socket.join(roomId.toString());
    user.roomId = roomId;
    console.log(`New client no.: ${clientId}, room no.: ${roomId}`);

    socket.emit('userSaved', user);
    usersConnected.push(user);

    const roomIndex = rooms.findIndex((r) => r.id === roomId);

    if (roomIndex >= 0) {
      rooms[roomIndex].players.push(user);
      if (rooms[roomIndex].players.length === ROOM_MAX_PLAYERS) {
        // const tableStatas: Partial<ITableStats> = {};
        // rooms[roomIndex].tableStats = tableStatas;
        console.log('aici');
        rooms[roomIndex] = roomService.setPlayersGameStatusActive(
          rooms[roomIndex]
        );
        const roomPlayersIds = rooms[roomIndex].players.map((p) => p.id!);
        usersConnected = userService.setUserConnectGameStatusActive(
          usersConnected,
          roomPlayersIds
        );
        rooms[roomIndex].gameActive = true;
        rooms[roomIndex].deck = dealersShuffle(generateDecks());
        rooms[roomIndex].tableStats = {
          dealerStats: {
            cards: [],
            bet: 0,
            totalPoints: 0,
          },
          playersStats: [
            // TODO FOR
            {
              name: rooms[roomIndex].players[0].name!,
              cards: [],
              chips: 500,
              turn: true,
              totalPoints: 0,
            },
            {
              name: rooms[roomIndex].players[1].name!,
              cards: [],
              chips: 500,
              turn: false,
              totalPoints: 0,
            },
          ],
        };

        for (let i = 0; i < ROOM_MAX_PLAYERS; ++i) {
          for (let j = 0; j < ROOM_MAX_PLAYERS; ++j) {
            rooms[roomIndex].tableStats.playersStats![j].cards.push(
              rooms[roomIndex].deck.shift()!
            );

            rooms[roomIndex].tableStats.playersStats![j].totalPoints =
              canculatePointByCards(
                rooms[roomIndex].tableStats.playersStats![j].cards
              );
          }

          // ! TEST DELAY
          await delay(5000);
          io.to(roomId.toString()).emit(
            'tableStats',
            rooms[roomIndex].tableStats
          );

          if (i == 0) {
            rooms[roomIndex].tableStats.dealerStats!.cards.push(
              rooms[roomIndex].deck.shift()!
            );
            rooms[roomIndex].tableStats.dealerStats!.totalPoints =
              canculatePointByCards(
                rooms[roomIndex].tableStats.dealerStats!.cards
              );

            // ! TEST DELAY
            await delay(5000);
            io.to(roomId.toString()).emit(
              'tableStats',
              rooms[roomIndex].tableStats
            );
          }
        }

        // playBet
        let playerFinished = 0;
        let foundNextPlayer = false;
        for (
          let i = 0;
          i < rooms[roomIndex].tableStats.playersStats!.length;
          ++i
        ) {
          if (rooms[roomIndex].tableStats.playersStats![i].totalPoints === 21) {
            rooms[roomIndex].tableStats.playersStats![i].turn = false;
            playerFinished++;

            if (!foundNextPlayer) {
              rooms[roomIndex].tableStats.playersStats![i].turn = true;
            }
          }
        }

        if (playerFinished === ROOM_MAX_PLAYERS) {
          rooms[roomIndex].tableStats.dealerStats?.cards.push(
            rooms[roomIndex].deck.shift()!
          );

          rooms[roomIndex].tableStats.dealerStats!.totalPoints =
            canculatePointByCards(
              rooms[roomIndex].tableStats.dealerStats?.cards!
            );

          if (rooms[roomIndex].tableStats.dealerStats!.totalPoints < 16) {
            rooms[roomIndex].tableStats.dealerStats?.cards.push(
              rooms[roomIndex].deck.shift()!
            );

            rooms[roomIndex].tableStats.dealerStats!.totalPoints =
              canculatePointByCards(
                rooms[roomIndex].tableStats.dealerStats?.cards!
              );
          }
        }

        // check for blackjack

        io.to(roomId.toString()).emit(
          'gameStarted',
          rooms[roomIndex].tableStats
        );
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

    console.log('ROOMS: ', rooms);
    console.log('CONNECTED USER: ', usersConnected);
  });

  socket.on('getTableStatus', (roomId) => {
    const room = roomService.findRoomById(roomId, rooms);

    if (room && room.gameActive) {
      console.log('HERREEEEE');
      console.log(room.tableStats);
      console.log(roomId);
      io.to(roomId.toString()).emit('tableStats', room.tableStats);
    }
  });

  socket.on('hit', (data: IPlayerActionPayload) => {
    const { roomId, userId } = data;
    console.log('HIT');

    const room = roomService.findRoomById(roomId, rooms);

    if (room && room.gameActive) {
      let playerStatsIndex = roomService.findUserStatsIndexById(userId, room);
      console.log('Room active');
      console.log(playerStatsIndex);
      console.log(
        'TURN:',
        room!.tableStats!.playersStats![playerStatsIndex!].turn
      );
      if (room.tableStats.playersStats) {
        if (
          playerStatsIndex !== undefined &&
          room.tableStats.playersStats[playerStatsIndex].turn
        ) {
          console.log('PLAYER HIT');
          room.tableStats.playersStats[playerStatsIndex].cards.push(
            room.deck.shift()!
          );
          room.tableStats.playersStats![playerStatsIndex].totalPoints =
            canculatePointByCards(
              room.tableStats.playersStats![playerStatsIndex].cards
            );

          if (
            room.tableStats.playersStats![playerStatsIndex].totalPoints >= 21
          ) {
            room.tableStats.playersStats[playerStatsIndex].turn = false;
            // get next player
            playerStatsIndex++;
            if (room.tableStats.playersStats.length === playerStatsIndex) {
              // playerStatsIndex = 0;
              room.tableStats.dealerStats?.cards.push(room.deck.shift()!);

              room.tableStats.dealerStats!.totalPoints = canculatePointByCards(
                room.tableStats.dealerStats?.cards!
              );

              if (room.tableStats.dealerStats!.totalPoints < 16) {
                room.tableStats.dealerStats?.cards.push(room.deck.shift()!);

                room.tableStats.dealerStats!.totalPoints =
                  canculatePointByCards(room.tableStats.dealerStats?.cards!);
              }
            } else {
              while (
                room.tableStats.playersStats[playerStatsIndex].totalPoints >= 21
              ) {
                playerStatsIndex++;
              }
              room.tableStats.playersStats[playerStatsIndex].turn = true;
            }
          }
          console.log(room);
          io.to(roomId.toString()).emit('tableStats', room.tableStats);
        } else {
          console.log('ITS NOT YOUR TURN!!!');
        }
      }
    }
  });

  socket.on('stand', (data: IPlayerActionPayload) => {
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
          // get next player
          playerStatsIndex++;
          if (room.tableStats.playersStats.length === playerStatsIndex) {
            playerStatsIndex = 0;
            room.tableStats.dealerStats?.cards.push(room.deck.shift()!);

            room.tableStats.dealerStats!.totalPoints = canculatePointByCards(
              room.tableStats.dealerStats?.cards!
            );

            if (room.tableStats.dealerStats!.totalPoints < 16) {
              room.tableStats.dealerStats?.cards.push(room.deck.shift()!);

              room.tableStats.dealerStats!.totalPoints = canculatePointByCards(
                room.tableStats.dealerStats?.cards!
              );
            }
          } else {
            while (
              room.tableStats.playersStats[playerStatsIndex].totalPoints >= 21
            ) {
              playerStatsIndex++;
            }

            room.tableStats.playersStats[playerStatsIndex].turn = true;
          }
          console.log(playerStatsIndex);
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

app.get('/me/:id', (req, res, next) => {
  const { id } = req.params;
  const user = usersConnected.find((user) => user.id === parseInt(id));
  console.log(usersConnected);
  res.send(user);
});

app.get('/table/:id', (req, res, next) => {
  const { id } = req.params;
  const tableStats = roomService.findRoomById(parseInt(id), rooms)?.tableStats;
  res.send(tableStats);
});

app.delete('/logout/:id', (req, res, next) => {
  const { id } = req.params;
  // TODO Refactor, no need for userConnected array
  const indexOfUser = usersConnected.findIndex(
    (user) => user.id === parseInt(id)
  );
  const indexOfRoom = rooms.findIndex(
    (room) => room.id === usersConnected[indexOfUser].roomId
  );
  const indexOfUserInRoom = rooms[indexOfRoom].players.findIndex(
    (player) => player.id === parseInt(id)
  );
  usersConnected.splice(indexOfUser, 1);
  rooms[indexOfRoom].players.splice(indexOfUserInRoom, 1);
  clientId--;
  console.log('ROOMS: ', rooms);
  console.log('CONNECTED USER: ', usersConnected);
  res.send({ id });
});
