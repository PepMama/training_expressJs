const connect = async () => {
  let result = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'pmaelic@outlook.fr',
      password: 'pep',
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const user = await result.json();
  if (user) {
    const socket = io('http://localhost:3000', {
      auth: { token: user.token },
    });

    socket.on('connect', () => {
      console.log('Connecté au serveur');

      socket.on('message', (data) => {
        console.log(data);
      });
    });
  }
};

connect();
