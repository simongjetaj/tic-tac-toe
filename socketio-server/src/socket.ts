import { Server } from 'socket.io';
import * as http from 'http';
import { IGameState } from './api/controllers/interfaces/game.interface';
import { config } from './configs/config';

const controller = require('./api/controllers/main.controller');
const roomController = require('./api/controllers/room.controller');
const gameController = require('./api/controllers/game.controller');

export default (httpServer: http.Server) => {
  const io = new Server(httpServer, {
    cors: {
      origin: [config.clientBaseUrl],
    },
  });

  io.on('connection', (socket) => {
    controller.respond(socket);

    socket.on('join_game', (roomId: string) => {
      roomController.joinRoom(io, socket, roomId);
    });

    socket.on('finish_game', (data: IGameState) => {
      gameController.finishGame(socket, data);
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
