import { Server } from 'socket.io';
import * as http from 'http';
import { IGameState } from './shared/interfaces/game.interface';

const controller = require('./api/controllers/main.controller');
const roomController = require('./api/controllers/room.controller');
const gameController = require('./api/controllers/game.controller');

export default (httpServer: http.Server) => {
  const io = new Server(httpServer, {
    cors: {
      origin: [process.env.CLIENT_BASE_URL],
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    controller.respond(socket);

    socket.on('join_game', (data: IGameState) => {
      roomController.joinRoom(io, socket, data);
    });

    socket.on('restart_game', (data: IGameState) => {
      gameController.restartGame(socket, data);
    });

    socket.on('leave_game', (data: IGameState) => {
      gameController.leaveGame(io, socket, data);
    });

    socket.on('request_game', (data: IGameState) => {
      gameController.requestGame(socket, data);
    });

    socket.on('update_game', (data: IGameState) => {
      gameController.updateGame(socket, data);
    });
  });

  return io;
};
