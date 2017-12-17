const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const app = express();
const {generateMessage, generateLocationMessage} = require('./utils/message');
var {Users} = require('./utils/users');
const {isValidString} = require('./utils/string-validation');
const publicPath = path.join(__dirname, '../public');
const PORT =  process.env.PORT || 8080;

app.use(express.static(publicPath));
var server = http.createServer(app);

var io = socketIO(server);
var hash = {};
var users = new Users();

io.on('connection', (socket) => {

  socket.on('join', (params, callback) => {
    if(!isValidString(params.username) || !isValidString(params.chatroom)){
      return callback("Either of username or chat room name is not valid");
    }
    //
    // if(!hash.hasOwnProperty(params.chatroom)) {
    //   var obj = [];
    //   obj.push(socket.id);
    //   hash[params.chatroom] = obj;
    //   console.log("hash = "+JSON.stringify(hash, undefined, 2));
    // }
    // else {
    //   hash[params.chatroom].push(socket.id);
    //   console.log("hash = "+JSON.stringify(hash, undefined, 2));
    // }

    socket.join(params.chatroom);
    users.removeUser(users.findUser(socket.id));
    users.addUser(socket.id, params.username, params.chatroom);
    socket.emit("newMessage", generateMessage('Admin', `Welcome to chat app ${params.username}`));
    socket.broadcast.to(params.chatroom).emit('newMessage', generateMessage('admin', `${params.username} joined`));
    io.to(params.chatroom).emit('updateUserList', users.getUserList(params.chatroom));
    callback();
  });

  socket.on('createMessage', function(message, callback){
    console.log("id =  "+socket.id);
    console.log("room =  "+Object.keys(socket.rooms));
    var room = Object.keys(socket.rooms).toString();
    room = room.split(',')[1];
    // hash[room].each(socket in sockets) {
      io.to(room).emit('newMessage', generateMessage(message.from, message.text));
      callback("message received from server");
    // }

    //sent message to all user

  });

  socket.on('geoLocation', function(message, callback){
    var location = message.coords.latitude + ', ' + message.coords.longitude;
    io.emit('locationMessage', generateLocationMessage(message.from, message.coords.latitude, message.coords.longitude));
    callback('location msg received from server');
  });


  socket.on('disconnect', () => {
    console.log("user is disconned "+socket.id);

    var user = users.removeUser(socket.id);
    console.log(JSON.stringify(user));
    io.to(user.room).emit('newMessage', generateMessage('admin', `${user.name} left`));
    io.to(user.room).emit('updateUserList', users.getUserList(user.room));
  });
});

server.listen(PORT, function(){
  console.log(`Server is up on ${PORT}`);
})

// console.log(__dirname + /../public);
