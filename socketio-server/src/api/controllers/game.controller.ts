import { Server, Socket } from 'socket.io';
import { GameStatus, IGameState } from './interfaces/game.interface';
const utilities = require('./utils/shared');

const getSocketGameRoom = (socket: Socket): string => {
  const socketRooms = utilities.getSocketRooms(socket);
  const gameRoom = socketRooms && socketRooms[0];

  return gameRoom;
};

const finishGame = (socket: Socket, gameState: IGameState) => {
  const gameRoom = getSocketGameRoom(socket);
  if (gameState.status === GameStatus.Won) {
    socket.emit('game_won', gameState);
    socket.to(gameRoom).emit('game_lost', gameState);
  } else if (gameState.status === GameStatus.Draw) {
    socket.emit('game_draw', gameState);
    socket.to(gameRoom).emit('game_lost', gameState);
  } else {
    socket.emit('game_updated', gameState);
    socket.to(gameRoom).emit('game_updated', gameState);
  }
};

const restartGame = (socket: Socket, gameState: IGameState) => {
  const gameRoom = getSocketGameRoom(socket);
  const sharedObj = {
    ...gameState,
    isInRoom: true,
    isGameStarted: true,
    isGameRestarted: true,
    status: GameStatus.Unfinished,
    matrix: [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ],
  };

  const player1GameState = {
    ...sharedObj,
    isPlayerTurn: false,
    playerSymbol: gameState.playerSymbol === 'x' ? 'x' : 'o',
  };

  const player2GameState = {
    ...sharedObj,
    isPlayerTurn: true,
    playerSymbol: gameState.playerSymbol === 'x' ? 'o' : 'x',
  };

  socket.emit('game_restarted', player1GameState);
  socket.to(gameRoom).emit('game_restarted', player2GameState);
};

const requestGame = (socket: Socket, gameState: IGameState) => {
  const gameRoom = getSocketGameRoom(socket);
  const newGameState = {
    ...gameState,
    isGameRequested: true,
  };

  socket.to(gameRoom).emit('game_requested', newGameState);
};

const leaveGame = (io: Server, socket: Socket, gameState: IGameState) => {
  const gameRoom = getSocketGameRoom(socket);
  socket.emit('game_left', gameState);
  socket.to(gameRoom).emit('game_left', gameState);

  io.in(gameRoom).socketsLeave(gameRoom);
};

const updateGame = (socket: Socket, gameState: IGameState) => {
  const gameRoom = getSocketGameRoom(socket);
  const player1GameState = {
    ...gameState,
    isPlayerTurn: false,
    playerSymbol: gameState.playerSymbol === 'x' ? 'x' : 'o',
  };
  const player2GameState = {
    ...gameState,
    isPlayerTurn: true,
    playerSymbol: gameState.playerSymbol === 'x' ? 'o' : 'x',
  };

  socket.emit('game_updated', player1GameState);
  socket.to(gameRoom).emit('game_updated', player2GameState);
};

module.exports = {
  finishGame,
  updateGame,
  requestGame,
  restartGame,
  leaveGame,
};
