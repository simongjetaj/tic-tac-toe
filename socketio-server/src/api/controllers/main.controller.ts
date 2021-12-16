import { Socket } from 'socket.io';

module.exports.respond = (socket: Socket) => {
  console.log(`New socket connected ${socket.id}`);
};
