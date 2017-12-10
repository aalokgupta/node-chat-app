const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const app = express();

const publicPath = path.join(__dirname, '../public');
const PORT =  process.env.PORT || 8080;

app.use(express.static(publicPath));
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket) => {
  console.log("new user is connected");

  // socket.emit('newMessage', {
  //   from: "aalok",
  //   message: "newMessage from aalok",
  //   createdAt: new Date().toString()
  // });

  socket.on('createMessage', function(message){
    console.log("createMessage "+JSON.stringify(message, undefined, 2));
    io.emit('newMessage', {
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    })
  });

  socket.on('disconnect', (socket) => {
    console.log("user is disconned");
  });
});

server.listen(PORT, function(){
  console.log(`Server is up on ${PORT}`);
})

// console.log(__dirname + /../public);
