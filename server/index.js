const app = require('express')()
const options = {
  cors:true,
  origins:["http://127.0.0.1:5347"],
 }
const http = require('http').createServer(app)
const io = require('socket.io')(http, options)
const cors = require('cors');
app.use(cors())

io.on('connection', socket => {
  socket.on('message', ({ name, message }) => {
    io.emit('message', { name, message })
  })
})

http.listen(4000, function() {
  console.log('listening on port 4000')
})