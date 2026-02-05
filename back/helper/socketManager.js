const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Conversation = require('./../module/conversation/conversation.model.js');
const User = require('./../module/user/user.model.js');

let io = null;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  });
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Token required'));
    }
    try {
      socket.user = jwt.verify(token, process.env.JWT_KEY);
      return next();
    } catch (e) {
      return next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const connectConversation = async () => {
      let conversationList = await Conversation.findAll({
        include: [
          {
            model: User,
            through: { attributes: [] },
            attributes: [],
            required: true,
            where: {
              id: socket.user.userId,
            },
            as: 'filter',
          },
        ],
      });
      conversationList.forEach((conversation) => {
        socket.join('conversation-' + conversation.id);
        console.log('Un utilisateur a rejoins la room : ' + 'conversation-' + conversation.id);
      });
    };
    connectConversation();
    console.log('Client connecté :' + socket.id);

    socket.on('join-conversation', (conversationId) => {
      socket.join('conversation-' + conversationId);
      console.log(`Socket ${socket.id} a rejoint la conversation ${conversationId}`);
    });

    socket.on('disconnect', () => {
      console.log('User has disconnect');
    });
  });
};

function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}

module.exports = { getIO, initSocket };
