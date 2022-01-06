import { Server, Socket } from 'socket.io';
import { GameStatus, IGameState } from '../../shared/interfaces/game.interface';
const utilities = require('./utils/shared');

const getSocketGameRoom = (socket: Socket): string => {
  const socketRooms = utilities.getSocketRooms(socket);
  const gameRoom = socketRooms && socketRooms[0];

  return gameRoom;
};

const restartGame = (socket: Socket, gameState: IGameState) => {
  const gameRoom = getSocketGameRoom(socket);
  const sharedGameState = {
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
    history: [],
  };

  const player1GameState = {
    ...sharedGameState,
    isPlayerTurn: false,
    playerSymbol: gameState.playerSymbol === 'x' ? 'x' : 'o',
  };

  const player2GameState = {
    ...sharedGameState,
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

const leaveGame = (
  io: Server,
  socket: Socket,
  gameState: IGameState,
  message: string = null
) => {
  const sharedGameState = {
    ...gameState,
    roomId: '',
    isInRoom: false,
    playerSymbol: 'x',
    status: GameStatus.Unfinished,
    isPlayerTurn: false,
    isGameStarted: false,
    isGameRequested: false,
    isGameRestarted: false,
    matrix: [
      ['', '', ''],
      ['', '', ''],
      ['', '', ''],
    ],
    history: [],
  };

  const gameRoom = getSocketGameRoom(socket);
  message = message ?? 'Exiting the game because one of you left the game';

  socket.emit('game_left', sharedGameState, message);
  socket.to(gameRoom).emit('game_left', sharedGameState, message);

  io.in(gameRoom).socketsLeave(gameRoom);
};

const updateGame = (io: Server, socket: Socket, gameState: IGameState) => {
  if (isGameHacked(gameState.history)) {
    return leaveGame(
      io,
      socket,
      gameState,
      'Exiting the game because one of you is trying to hack the game'
    );
  }

  const gameRoom = getSocketGameRoom(socket);
  const result = isSolved(gameState.matrix);
  const isGameWon = result === 1 || result === 2;
  const isGameDraw = result === 0;

  if (isGameWon) {
    socket.emit('game_won', { ...gameState, status: GameStatus.Won });
    socket
      .to(gameRoom)
      .emit('game_lost', { ...gameState, status: GameStatus.Won });
  } else if (isGameDraw) {
    socket.emit('game_draw', gameState);
    socket.to(gameRoom).emit('game_lost', gameState);
  } else {
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
  }
};

const isSolved = (board: string[][]) => {
  switch (true) {
    case player('x').wins(board):
      return 1;

    case player('o').wins(board):
      return 2;

    case unfinished(board):
      return -1;

    default:
      return 0;
  }
};

const horizontal = (player: 'x' | 'o', board: string[][]) =>
  board.some((row) => row.every((spot) => spot == player));

const vertical = (player: 'x' | 'o', board: string[][]) =>
  board.some((_, i) => board.every((row) => row[i] == player));

const diagonals = (player: 'x' | 'o', board: string[][]) =>
  board.every((row, i) => row[i] == player) ||
  board.every((row, i) => row[3 - 1 - i] == player);

const player = (symbol: 'x' | 'o') => ({
  wins: (board: string[][]) =>
    [horizontal, vertical, diagonals].some((full) => {
      return full(symbol, board);
    }),
});

const unfinished = (board: string[][]) =>
  board.some((row: string[]) => row.some((spot: string) => !spot));

const isGameHacked = (history: string[]): boolean => {
  for (let i = 0; i < history.length - 1; i++) {
    const chars = history[i] + history[i + 1];

    if (chars == 'xx' || chars == 'oo') {
      return true;
    }
  }

  return false;
};

module.exports = {
  updateGame,
  requestGame,
  restartGame,
  leaveGame,
  isSolved,
  isGameHacked,
};
