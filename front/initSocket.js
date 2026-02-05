const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connecté au serveur');

  socket.on('message', (data) => {
    console.log(data);
  });
});
