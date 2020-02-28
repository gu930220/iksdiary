module.exports = {
    HTML:function(list, body, control){
      return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>ikmo's diary</title>
          <link rel="stylesheet" href="css/style.css">
      </head>
      <body>
      <section id="container">
          <header class="header">
              <h1 class="logo">
                  <a href="/">Ikmo's Diary</a>
              </h1> 
          </header>
          <section id="main_container">
              <div>
                  <button onclick="" style="float:right" >글쓰기</button>
              </div>
              
              <ul>
                  <li>제목</li>
                  <li>ㅇㅇ</li>
              </ul>
          </section>
      </section>
      </body>
      </html>
      `;
    },list:function(topics){
      var list = '<ul>';
      var i = 0;
      while(i < topics.length){
        list = list + `<li><a href="/?id=${topics[i].id}">${sanitizeHtml(topics[i].title)}</a></li>`;
        i = i + 1;
      }
      list = list+'</ul>';
      return list;
    }
}