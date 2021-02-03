const app = require('express')()
const options = {
  cors:true,
  origins:["http://127.0.0.1:5347"],
 }
const http = require('http').createServer(app)
const io = require('socket.io')(http, options)
const cors = require('cors');
app.use(cors())

// Run when client connects
io.on('connection', socket => {
  socket.on('message', ({ name, message, email, username, avatar }) => {
    io.emit('message', { name, message, email, username, avatar })
  });

  // // Welcome current user
  // socket.emit('message', 'Welcome to the chatroom')

  // Broadcast when a user connects
  socket.broadcast.emit('message', 'A user has joined the chat');

  // Runs when client Disconnects
  socket.on('disconnect', () => {
    io.emit('message', 'A user has left the chat');
  });
})

http.listen(4000, function() {
  console.log('listening on port 4000')
})