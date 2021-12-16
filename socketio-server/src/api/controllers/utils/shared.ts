import { Socket } from 'socket.io';

const getSocketRooms = (socket: Socket): string[] => {
  return Array.from(socket.rooms.values()).filter((r) => r !== socket.id);
};

module.exports = { getSocketRooms };
