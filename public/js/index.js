
var socket = io();

  socket.on('connect', function () {
    console.log("connected");
  });

  socket.on('disconnect', function () {
    console.log('disconnected from server');
  });

  function scrolltoBottom() {

    var ol = jQuery('#ol-received-message');
    var newMessage = ol.children('li:last-child');
    var clientHeight = ol.prop('clientHeight');

    console.log("clientHeight = "+clientHeight);
    var scrollTop =  ol.prop('scrollTop');
    console.log("scrollTop = "+scrollTop);
    var scrollHeight = ol.prop('scrollHeight');
    console.log("scrollHeight = "+scrollHeight);

    if(newMessage !== undefined) {
      var newMessageHeight = newMessage.innerHeight();
      console.log("newMessageHeight = "+newMessageHeight);
      var lastMessageHeight = 5; //newMessageHeight.prev().innerHeight();
      console.log("lastMessageHeight = "+lastMessageHeight);
    }

    if(clientHeight + scrollTop + 74 >= scrollHeight) {
      console.log("should scroll");
      ol.scrollTop(scrollHeight);
    }
  }

  socket.on('newMessage', function(message){
    var formatedTime = moment(message.createdAt).format('h::mm a');
    console.log("newMessage "+JSON.stringify(message, undefined, 2));
    var li = jQuery('<li class = "li-message received-msg-header"></li>');
    li.text(`${message.from} ${formatedTime}`);
    jQuery('#ol-received-message').append(li);
    var li1 = jQuery('<li class = "li-message message"></li></br>');
    li1.text(`${message.text}`);
    jQuery('#ol-received-message').append(li1);
    scrolltoBottom();
  });

  socket.on('locationMessage', function(location){
    var formatedTime = moment(location.createdAt).format('h::mm a');
    console.log("locationMessage "+JSON.stringify(location, undefined, 2));
    var li = `<li class = "li-message received-msg-header ">${location.from} ${formatedTime}</li>`;
    var li_attribute = jQuery(li);
    jQuery('#ol-received-message').append(li_attribute);
    var li1 = `<li class = "li-message message"> <a href = ${location.locationUrl}>My Location</a></li>`;
    var li_attribute1 = jQuery(li1);
    jQuery('#ol-received-message').append(li_attribute1);
    scrolltoBottom();
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
