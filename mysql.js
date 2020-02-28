var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '992255',
  database : 'iksdiary'
});
 
connection.connect();
 
connection.query('SELECT * FROM list', function (error, results, fields) {
    if (error) {
        console.log(error);
    }
    console.log(results);
});
 
connection.end();