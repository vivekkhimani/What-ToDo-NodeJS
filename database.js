/*
A file that connects to the MySQL instance on Google Cloud. Credentials stored in a seperate local file unlinked to version control.
*/

const mysql = require('mysql');
require('dotenv').config();

// Database Connection for Production

// let config = {
//     user: process.env.SQL_USER,
//     database: process.env.SQL_DATABASE,
//     password: process.env.SQL_PASSWORD,
// }

// if (process.env.INSTANCE_CONNECTION_NAME && process.env.NODE_ENV === 'production') {
//   config.socketPath = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
// }

// let connection = mysql.createConnection(config);


let connection = mysql.createConnection({
   host: process.env.DB_HOST,
   instance_name: process.env.DB_INSTANCE_NAME,
   user: process.env.DB_USER,
   password: process.env.DB_PASS,
   database: process.env.DB_DATABASE 
});

connection.connect(function(err){
   if (err){
	  console.log("Error connecitng to db: " + err.stack);
	  return;
   }
   console.log("Connected to db as thread id: " + connection.threadId);
});

module.exports = connection;
