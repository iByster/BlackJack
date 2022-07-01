import http from 'http';
import express from 'express';

// TODO .env
const PORT = 8080;

const app = express();
const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`SERVER STARTED ON PORT: ${PORT}`);
})