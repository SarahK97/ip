const mysql = require("mysql2");

var connection = mysql.createPool({
  connectionLimit: 10,
  user: 'root',
  host: 'esc-mysql', //'127.0.0.1','esc-mysql'
  password: 'password', // or ''
  database: 'easystepconnect_v0',
  port: "3306"
});

module.exports = connection;