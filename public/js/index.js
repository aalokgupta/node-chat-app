
var socket = io();

  socket.on('connect', function () {
    console.log("connected");
  });

  socket.on('disconnect', function () {
    console.log('disconnected from server');
  });

  socket.on('newMessage', function(message){
    console.log("newMessage "+JSON.stringify(message, undefined, 2));
    var li = jQuery('<li class = "li-message"></li>');
    li.text(`${message.from} ${message.createdAt} : ${message.text}`)
    jQuery('#ol-received-message').append(li);
  });

  socket.on('locationMessage', function(location){
    console.log("locationMessage "+JSON.stringify(location, undefined, 2));
    var li = `<li class = "li-message">${location.from} ${location.createdAt}  <a href = ${location.locationUrl}>my location</a></li>`;
    var li_attribute = jQuery(li);
    // li.text(`${message.from}: ${message.text}`)
    jQuery('#ol-received-message').append(li_attribute);
  });

  jQuery('#btn-send-message').on('click', function(e){
    console.log("send button click");
    var text = jQuery('#text-sent-message').val();
    var username = jQuery('#text-user-name').val() || 'Anonymous';
    console.log(`text = ${text}`);
    socket.emit('createMessage', {
      from: username,
      text: text
    }, function(message) {
      console.log(`${message}`);
    });
  });

  jQuery('#btn-send-location').on('click', function(e){
    console.log("send location btn clicked");
    var username = jQuery('#text-user-name').val() || 'Anonymous';
    if("geolocation" in navigator){
      console.log("geolocation is avavilable in navigator");
        navigator.geolocation.getCurrentPosition(function(position){
          console.log("inside getCurrentPosition");
          // var locationMsg = ;
          console.log("location = "+JSON.stringify(position, undefined, 2));
          socket.emit('geoLocation', {from: username,
                                      coords: {
                                                latitude: position.coords.latitude,
                                                longitude: position.coords.longitude
                                              }

          }, function(message) {
            console.log(`${message}`);
          });
        });
    } else {
      alert("geolocation is not avavilable");
    }
  });
