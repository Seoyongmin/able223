/******************************************************
 * 기본설정
 ******************************************************/
var express = require('express');
var app = express();

//3000포트 연결
app.listen(3000, function(){
  console.log('Connected!!!');
})

//post방식 파라미터 전달을 위한 bodyParser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));

//html 태그 정렬
app.locals.pretty = true;

//정적파일 사용
app.use(express.static('public'));

// 템플릿 엔진 사용
app.set('view engine', 'jade');
app.set('views', './views');

//DB 접속정보
var OrientDB = require('orientjs');
var server = OrientDB({
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: 'java'
});
var db = server.use('bed');

/******************************************************
 * 라우터
 ******************************************************/
app.get('/', function(req, res){
  res.render('main');
})

app.post('/login', function(req, res){
  //사용자 입력 데이터
  var id = req.body.id;
  var pwd = req.body.pwd;

  //DB 데이터
  var sql = 'SELECT PASSWORD FROM USER WHERE ID=:id AND PASSWORD=:pwd';
  var param = {
    params:{
      id: id,
      pwd: pwd
    }
  };
  db.query(sql, param).then(function(result){
    if(result.length > 0){
      var sql2 = 'SELECT FROM BOARD';
      db.query(sql2).then(function(boardList){
        res.render('loginSuccess', {boardList:boardList});
      })
    }else{
      res.send(
        '<script type="text/javascript">alert("ID가 존재하지 않거나 비밀번호가 틀립니다.");</script>'
              );
    }
  });
})

app.get('/board/list', function(req, res){
  var sql = 'SELECT FROM BOARD';
  db.query(sql).then(function(boardList){
    res.render('loginSuccess', {boardList:boardList});
  })
})

app.get('/board/insert', function(req, res){
  res.render('boardInsert');
})

app.post('/board/insert', function(req, res){
  var title = req.body.title;
  var contents = req.body.contents;
  var id = 'admin';
  var sql = 'INSERT INTO BOARD(TITLE, CONTENTS, ID) VALUES(:title, :contents, :id)';
  db.query(sql, {
    params:{
      title:title,
      contents:contents,
      id:id
    }
  }).then(function(result){
    res.redirect('/board/' + encodeURIComponent(result[0]['@rid']))
  })
})

app.get('/board/:rid', function(req, res){
  var sql = 'SELECT FROM BOARD WHERE @rid=:rid';
  var rid = req.params.rid;
  db.query(sql, {params:{rid:rid}}).then(function(board){
    res.render('board', {board:board[0]});
  })
})

app.get('/board/update/:rid', function(req, res){
  var sql = 'SELECT FROM BOARD WHERE @rid=:rid';
  var rid = req.params.rid;
  db.query(sql, {params:{rid:rid}}).then(function(board){
    res.render('boardUpdate', {board:board[0]});
  })
})

app.post('/board/update', function(req, res){
  var sql = 'UPDATE BOARD SET TITLE=:title, CONTENTS=:contents WHERE @rid=:rid';
  var title = req.body.title;
  var contents = req.body.contents;
  var rid = decodeURIComponent(req.body.rid);
  db.query(sql, {
    params:{
      title:title,
      contents:contents,
      rid:rid
    }
  }).then(function(result){
    res.redirect('/board/' + encodeURIComponent(rid))
  })
})

app.get('/board/delete/:rid', function(req, res){
  var sql = 'DELETE FROM BOARD WHERE @rid=:rid';
  var rid = req.params.rid;
  db.query(sql, {params:{rid:rid}}).then(function(result){
    res.redirect('/board/list');
  })
})
