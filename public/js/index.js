
var socket = io();
socket.on('connect', function () {
  console.log("connected");

  // socket.emit('createMessage', {
  //   from: "clientAalok",
  //   text: "createdMessage from clientAalok"
  // });

});

socket.on('disconnect', function () {
  console.log('disconnected from server');
});

socket.on('newMessage', function(message){
  console.log("newMessage "+JSON.stringify(message, undefined, 2));
});
