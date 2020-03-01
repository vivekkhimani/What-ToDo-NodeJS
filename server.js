/*THE SQL PART IS NOT FUNCTIONAL AS OF NOW SO DON'T TRY TO TEST IT (Vivek)*/

//imports and require statements.
const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const mysql = require('mysql');

//sql init
const connection = mysql.createConnection({
   host: 'localhost',
   user: 'root',
   password: '',
   database: 'what_todo'
});

connection.connect((err) => {
   if (err){
   console.log(err);
   }
   else{
	  console.log('SUCCESS');
   }
});

connection.end((err) => {
   if (err){
	  console.log(err);
   }
   else{
	  console.log("TERMINATED");
   }
});

//initiating server and app
const app = express();
const port = 3000;
app.use(express.static('public'));

//allow sending and receiving different objects
app.use(bodyParser.urlencoded({
	extended:true
}));
app.use(bodyParser.json());

//allow cross domain communication
var allowCrossDomain = function(req,res,next){
	res.header('Access-Control-Allow-Origin','*');
	res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers','Content-Type');

	next();
}
app.use(allowCrossDomain);

//INSERT GET AND POST ENDPOINTS


//listen
app.listen(port, () => console.log('Listening on port '+port));
