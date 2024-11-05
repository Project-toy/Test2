var http = require('http');
var fs = require('fs');
//내가 해보는 코드
var figlet = require("figlet");

// 웹 서버 객체를 만든다.
var server = http.createServer();
 
// 웹 서버를 시작하여 3000번 포트에서 대기한다. //http://localhost:3000/
var port = 3000;
server.listen(port, function(){
    console.log('웹 서버가 시작되었습니다. : %d', port);
})

// 클라이언트 연결 이벤트 처리
server.on('connection', function(socket){
    var addr = socket.address();
    console.log('클라이언트가 접속했습니다. : %s, %d',addr.address, addr.port);
});
 
// 클라이언트 요청 이벤트 처리 우리가 보는 사이트 인듯 하다.
server.on('request', function(req,res){
    console.log('클라이언트 요청이 들어왔습니다.');
    // 웹 표시용 메세지
    
    var filename = "index.html";
    fs.readFile(filename, function(err, data){
        if(err) throw err;
        
        res.writeHead(200, {"Content-Type":"text/html"});
        res.write(data);
        res.end();
    });
    
    //여기도 도전코드, 터미널에서만 나온다..
    /*
    var filename = "print.js";
    fs.readFile(filename, function(err, data){
        if(err) throw err;
        
        res.writeHead(200, {"Content-Type":"text/javascript"});
        res.write(data);
        res.end();
    });
    */
});
 
// 서버 종료 이벤트 처리
server.on('close', function(){
    console.log('서버가 종료됩니다.');
});
