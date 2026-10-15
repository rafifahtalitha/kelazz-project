import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import app from './app.js';
import setupLiveQuizHandler from './handlers/liveQuizHandler.js';

const server = http.createServer(app);

// Inisialisasi Server Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Menghubungkan Socket.io dengan Event Handler Arena Live
setupLiveQuizHandler(io);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server Kelazz berjalan di http://localhost:${PORT}`);
});