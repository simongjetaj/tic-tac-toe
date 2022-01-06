import { Server, Socket } from 'socket.io';
import { IGameState } from '../../shared/interfaces/game.interface';
const utilities = require('./utils/shared');

const joinRoom = async (io: Server, socket: Socket, gameState: IGameState) => {
  console.log(`New user joining room: ${gameState.roomId}`);
  const socketRooms = utilities.getSocketRooms(socket);
  const connectedSockets = io.sockets.adapter.rooms.get(gameState.roomId);

  if (socketRooms?.length > 0 || connectedSockets?.size === 2) {
    socket.emit('room_joined_error', {
      error: 'This room is full!',
    });
  } else {
    await socket.join(gameState.roomId);
    socket.emit('room_joined', { ...gameState, isInRoom: true });

    if (io.sockets.adapter.rooms.get(gameState.roomId).size === 2) {
      const sharedGameState = {
        ...gameState,
        isInRoom: true,
        isGameStarted: true,
      };

      socket.emit('game_started', {
        ...sharedGameState,
        isPlayerTurn: true,
      });
      socket.to(gameState.roomId).emit('game_started', {
        ...sharedGameState,
        isPlayerTurn: false,
      });
    }
  }
};

module.exports = { joinRoom };
