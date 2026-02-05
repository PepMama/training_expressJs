const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connecté au serveur');
});
