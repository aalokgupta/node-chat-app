var generateMessage = (from, text) => {
  return {
    from: from,
    text: text,
    createdAt: new Date().getTime()
  }
};

var generateLocationMessage = (from, latitude, longitude) => {
  return {
    from: from,
    locationUrl: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    createdAt: new Date().getTime()
  }
};


module.exports = {generateMessage, generateLocationMessage};
