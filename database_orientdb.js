var OrientDB = require('orientjs');
var server = OrientDB({
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: 'java'
});
var db = server.use('bed');

/*
db.record.get('#21:0').then(function(record){
  console.log('recode:', record.title);
});
*/

//READ
var sql = 'SELECT FROM TOPIC WHERE @rid=:id';
var param = {
  params:{
    id:'#21:0'
  }
};
db.query(sql, param).then(function(results){
  console.log(results);
});
