var db = require('./lib/db');
var http = require('http');
var url = require('url');
var qs = require('querystring');
var hostname = '127.0.0.1'; // localhost와 동일 
var port = 3000; 
// var db = mysql.createConnection({
//   host : 'localhost',
//   user : 'root',
//   password : '992255',
//   database : 'iksdiary'
// });
// db.connect();

function templateHTML(title,body,button){
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>${title}</title>
      <link rel="stylesheet" href="css/style.css">
  </head>
  <body>
  <section id="container">
      <header class="header">
          <h1 class="logo">
              <a href="/">Ikmo's Diary : 현재의 나를 알기 위한 이정표.</a>
          </h1> 
      </header>
      <section id="main_container">
          
          
          ${body}
          ${button}
      </section>
  </section>
  </body>
  </html>
  `
}

function templateList(filelist){
  var list = '<ul>';
  var j = 0;
  while(j < filelist.length){
    list = list + `<li><a href="/?id=${filelist[j].id}">${filelist[j].id}&nbsp;&nbsp;${filelist[j].title}&nbsp;&nbsp;${filelist[j].created}</a></li>`;
    j = j + 1;
  }
    list = list + '<ul>';
    return list;
  
}



var app = http.createServer(function(request,response){
  var title = 'ikmo';
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  // console.log(_url);
  if(pathname === '/'){
    if (queryData.id === undefined){
    // console.log(_url);


      db.query(`SELECT id, title, description, created FROM list`, function(error,results){

        var title = 'iksdiary';
        var list = templateList(results);
        var html = templateHTML(title,list,`
        <div>
        <button onclick="location.href='/create'" style="float:right" >글쓰기</button>
        </div>
        `);
        response.writeHead(200);
        response.end(html);
      });
    } else {
      db.query(`SELECT * FROM list`, function(error,results){
        if (error) {
          throw error;
        }
        db.query(`SELECT * FROM list where id=${queryData.id}`, function(error2, result){
          if (error2) {
            throw error;
          }
        
        var title = result[0].title;
        var description = result[0].description;
        var html = templateHTML(title,`<h2>${title}</h2>${description}`,`
        <div>
        <button onclick="location.href='/update?id=${queryData.id}'" style="float:right" >수정</button>
        </div>
        <div>
        <form action="delete_process" method="post">
          <input type="hidden" name="id" value="${queryData.id}">
          <input type="submit" value="삭제">
        </form>
        `);
        response.writeHead(200);
        response.end(html);
    })
  
  });


  }
} else if (pathname ==='/create'){
      var title = 'create';
      var html = templateHTML(title, 
        `
        <form action="/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `,``);
        response.writeHead(200);
        response.end(html);
} else if (pathname ==='/create_process'){
  var body = '';
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
      var post = qs.parse(body);
      db.query(`
        INSERT INTO list (title, description, created) 
          VALUES(?, ?, NOW())`,
        [post.title, post.description], 
        function(error, result){
          if(error){
            throw error;
          }
          response.writeHead(302, {Location: `/?id=${result.insertId}`});
          response.end();
        }
      )
  });
} else if (pathname ==='/update'){
  db.query(`SELECT * FROM list`, function(error,results){
    if (error) {
      throw error;
    }
    db.query(`SELECT * FROM list where id=${queryData.id}`, function(error2, result){
      if (error2) {
        throw error;
      }
    
    var title = result[0].title;
    var description = result[0].description;
    var html = templateHTML(title,
      `
      <form action="/update_process" method="post">
        <input type="hidden" name="id" value="${result[0].id}">
        <p><input type="text" name="title" placeholder="title" value="${result[0].title}"></p>
        <p>
          <textarea name="description" placeholder="description">${result[0].description}</textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
    `,`
    `);
    response.writeHead(200);
    response.end(html);
    });
  });
} else if (pathname ==='/update_process'){
  var body = '';
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
      var post = qs.parse(body);
      db.query('UPDATE list SET title=?, description=? WHERE id=?', [post.title, post.description, post.id], function(error, result){
        if(error){
          throw error;
        }
        response.writeHead(302, {Location: `/?id=${post.id}`});
        response.end();
      })
  });
} else if (pathname ==='/delete_process'){
  var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        db.query('DELETE FROM list WHERE id = ?', [post.id], function(error, result){
          if(error){
            throw error;
          }
          response.writeHead(302, {Location: `/`});
          response.end();
        });
    });
} else {
  response.writeHead(404);
  response.end('Not found');
}

});
app.listen(3000);

console.log('Server running at http://'+hostname+':'+port);

