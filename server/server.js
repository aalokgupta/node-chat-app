const express = require('express');
const path = require('path');
const app = express();

const publicPath = path.join(__dirname, '../public');
const PORT =  8080;

app.use(express.static(publicPath));

console.log(`${publicPath}`);


app.listen(PORT, function(){
  console.log(`Server is up on ${PORT}`);
})

// console.log(__dirname + /../public);
