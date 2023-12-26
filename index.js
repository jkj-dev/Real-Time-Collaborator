const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/testHealth', (req, res) => res.send('success'));

io.on('connection', (socket) => {
  const res = { id: socket.id, userName: socket.userName };
  socket.on('user-input', (data) => {
    res.data = data;
    res.userName = data;
    socket.broadcast.emit('user-data', res);
    io.emit('user-name', res);
  });

  socket.on('mousemove', (data) => {
    res.data = data;
    socket.broadcast.emit('user-mouse-data', res);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(PORT);
});
