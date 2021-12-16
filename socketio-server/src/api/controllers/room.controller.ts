import { Server, Socket } from 'socket.io';
const utilities = require('./utils/shared');

const joinRoom = async (io: Server, socket: Socket, roomId: string) => {
  console.log(`New user joining room: ${roomId}`);
  const socketRooms = utilities.getSocketRooms(socket);
  const connectedSockets = io.sockets.adapter.rooms.get(roomId);

  if (socketRooms?.length > 0 || connectedSockets?.size === 2) {
    socket.emit('room_joined_error', {
      error: 'This room is full!',
    });
  } else {
    await socket.join(roomId);
    socket.emit('room_joined');

    if (io.sockets.adapter.rooms.get(roomId).size === 2) {
      socket.emit('game_started', true);
      socket.to(roomId).emit('game_started', false);
    }
  }
};

module.exports = { joinRoom };
