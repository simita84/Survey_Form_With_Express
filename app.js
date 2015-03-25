//#---------------Initial Configurations start-----------------------
// require express
var express = require("express");

// path module -- try to figure out where and why we use this
var path = require("path");

// create the express app
var app = express();

// #-----------For handling post--------------
// # 1. var bodyParser = require('body-parser');
//app.use(bodyParser.urlencoded());

// app.post('/result',function(request, response){
// 	console.log(response);
// });
// #-----------For handling get requests--------------------
// # 2. 
//app.get('/', function(req, res) {
//  res.render("index");
// })

// static content 
app.use(express.static(path.join(__dirname, "./static")));
// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views')); 
app.set('view engine', 'ejs');
// tell the express app to listen on port 8000
var server = app.listen(6789, function() {
 console.log("listening on port 6789");
})
// this gets the socket.io module  
var io = require('socket.io').listen(server);  
  
//#---------------Initial Configurations end-----------------------

// http://localhost:8000/ home page rendering
app.get('/', function(request, response) {
  response.render("index");
});


// Whenever a connection event happens (the connection event is built in)
// run the following code
 
io.sockets.on('connection', function (socket) {

  var rand_number =  Math.floor((Math.random() *(1000-1) + 1));
  var user_info = {};
	//all the socket code goes in here!	
	console.log("-----------------WE ARE USING SOCKETS!-----------");
  
  // #1 - New user connected recieving event
	// socket.on("got_new_user", function (data){
	// 	new_user_info = {name :  data.user_name , id : socket.id }
	// });
	
	//-----Listeneing to client event posting_form
	socket.on('posting_form',function(data){
	 user_info = {
	 							 name 		: data.name ,
	               location : data.location,
	               language : data.language,
	               comment  : data.comment
	             }
	             
	//-----------Emitiing even your_info  to client that initiated request
	 socket.emit('your_info'		,user_info);
	  //console.log(user_info);
	});

	//-----------Emitiing even lucky_number  to client that initiated request
	socket.emit('lucky_number' ,{rand_number:rand_number });

  //#  when somebody leaves the room. 
	socket.on('disconnect', function () {
	});

}); 
   
//Server-side emit syntax

// 1. Emit: sends data from the server to the specific client who initiated contact.
//socket.emit('server_response', {response: "sockets are the best!"});

// 2. Broadcast: sends data from the server to everyone BUT the client that initiated the contact.
//socket.broadcast.emit('server_response', {response: "sockets are the best!"});

// 3. Full Broadcast: sends data to all connected clients.
//io.emit('server_response', {response: "sockets are the best!"});
 


 
