var mysql = require('mysql');
var db = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'992255',
  database:'iksdiary'
});
db.connect();
module.exports = db;




