const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const app = express();
const {generateMessage, generateLocationMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const PORT =  process.env.PORT || 8080;

app.use(express.static(publicPath));
var server = http.createServer(app);
var io = socketIO(server);

io.on('connection', (socket) => {
  console.log("new user is connected");

  socket.emit("newMessage", generateMessage('Admin', 'Welcome to chat app'));

  // broadcast message to all connected to all user except the sender
  socket.broadcast.emit('newMessage', generateMessage('admin', "New user joined"));

  // socket.emit('newMessage', {
  //   from: "aalok",
  //   message: "newMessage from aalok",
  //   createdAt: new Date().toString()
  // });

  socket.on('createMessage', function(message, callback){
    console.log("createMessage "+JSON.stringify(message, undefined, 2));
    //sent message to all user
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback("message received from server");
  });

  socket.on('geoLocation', function(message, callback){
    console.log("message received from server "+JSON.stringify(message, undefined, 2));
    // console.log("message received from server ";
    var location = message.coords.latitude + ', ' + message.coords.longitude;
    io.emit('locationMessage', generateLocationMessage(message.from, message.coords.latitude, message.coords.longitude));
    callback('location msg received from server');
  });

  socket.on('disconnect', (socket) => {
    console.log("user is disconned");
  });
});

server.listen(PORT, function(){
  console.log(`Server is up on ${PORT}`);
})

// console.log(__dirname + /../public);
