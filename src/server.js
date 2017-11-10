var express = require('express');
var app = express();
var path = require('path');

const port = 8080;

app.use('/public', express.static(path.join(__dirname, '../public')))

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/../public/index.html'));
});

app.listen(port, function(){
  console.log(`Listening on port ${port}`);
});