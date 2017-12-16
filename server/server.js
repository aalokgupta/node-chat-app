const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const app = express();
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isValidString} = require('./utils/string-validation');
const publicPath = path.join(__dirname, '../public');
const PORT =  process.env.PORT || 8080;

app.use(express.static(publicPath));
var server = http.createServer(app);

var io = socketIO(server);

io.on('connection', (socket) => {
  console.log("new user is connected");

  socket.on('join', (params, callback) => {
    if(!isValidString(params.username) || !isValidString(params.chatroom)){
      callback("Either of username or chat room name is not valid");
    }

    socket.join(params.chatroom);
    socket.emit("newMessage", generateMessage('Admin', `Welcome to chat app ${params.username}`));
    socket.broadcast.to(params.chatroom).emit('newMessage', generateMessage('admin', `${params.username} joined`));
    callback();
  });



  socket.on('createMessage', function(message, callback){
    console.log("createMessage "+JSON.stringify(message, undefined, 2));
    //sent message to all user
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback("message received from server");
  });

  socket.on('geoLocation', function(message, callback){
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
