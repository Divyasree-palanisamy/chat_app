import http from 'http';
import { Server } from 'socket.io';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {

    origin: ["http://localhost:5173",
      "https://commonchatapp.netlify.app" // ✅ production
    ],
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log("New client connected");

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => console.log('Server running on port 3000'));
