//imports and require statements.
const express = require('express');
const request = require('request');
const bodyParser = require('body-parser');
const connection = require('./database');
const crypto = require('crypto');

//generating salt for password hashing
var genSalt = function(length){
	return crypto.randomBytes(Math.ceil(length/2)).toString('hex').slice(0,length);
};

//generate normal hash
var normalHash = function(userPassword){
	const normalHash = crypto.createHash('sha512').update(userPassword).digest('hex');
	return normalHash;
};

//generate salted hash
var sha512 = function(password,salt){
	var hash = crypto.createHmac('sha512',salt);
	hash.update(password);
	var value = hash.digest('hex');
	return{
		salt:salt,
		passwordHash:value
	};
};


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
};
app.use(allowCrossDomain);

//db test endpoint for seeing the data in the db. WILL BE REMOVED AFTER DEV IS COMPLETE
app.route('/test_db').get(function(req,res,next){
	connection.query(
		"SELECT * from `users`",
		function(error,results,fields){
			if (error) throw error;
			res.json(results);
		}
	);
});

//db get user endpoint for login verification
app.get('/check_user',function(req,res,next){
	const user_email = req.query.email;
	const my_pass = req.query.password;
	const pass = normalHash(my_pass);

	console.log(user_email);
	console.log(pass);

	//make sql query
	connection.query("SELECT email from `users` WHERE email='"+user_email+"' AND password_hash='"+pass+"'",function (error,results,fields) {
		if (error) throw error;
		console.log("reached");
		//res.json(results);
		res.send(results);
	}
	);
});

//db post endpoint for creating new user for create account
app.post('/post_db',function (req,res,next) {
	const data = req;
	const first_name = data.body.first_name;
	const last_name = data.body.last_name;
	const email = data.body.email;
	const password = data.body.password;
	const password_hash = normalHash(password); //512 hashed
	const uid_password = sha512(password,genSalt(16)).passwordHash; //salted unique hash
	connection.query(
		"INSERT into `users` VALUES('"+first_name+"','"+last_name+"','"+email+"','"+password_hash+"','"+uid_password+"')",//finish the query
		function(error,results,fields){
			if (error){
				res.status(400).send("user exists.");
			}
			else{
				res.status(200).send("user added.");
			}
		}
	);
});

//listen
app.listen(port, () => console.log('Listening on port '+port));
