var express = require('express');
var app = express();
var session = require('express-session');
var app = express();
app.use(session({
  secret: 'abc',
  resave: false,
  saveUninitialized: true
}));
app.listen(3000, function(){
  console.log('Connected!!!');
});
