const { Server } = require('socket.io');

let io = null;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connecté: ' + socket.id);
  });
};

function getIo() {
  if (!io) {
    throw new Error('Socket io is not initialized');
  }
  return io;
}

module.exports = { getIo, initSocket };
