import http from 'http';
import express from 'express';
import { Server } from 'socket.io';
import cors from 'cors';

// TODO .env
const PORT = 5446;

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {});

server.listen(PORT, () => {
    console.log(`SERVER STARTED ON PORT: ${PORT}`);
})

io.on('connection', (socket) => {
    console.log('a user connected')
})

