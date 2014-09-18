// require all your dependencies aka VITAMINS
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


// requiring your modules aka LIVER, KIDNEYS etc
var routes = require('./routes/index');
var users = require('./routes/users');

/////////////////////////////////////////////////
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/chat');
////////////////////////////////////////////////


var app = express();

// /bin/www file sans var app aka the HEART of your app
var debug = require('debug')('chat');

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

// **** Added this line to create our socket functionalty. Socketio listens to an HTTP object
io = require('socket.io').listen(server);

// We add this so we can recieve the event on our server side. io.sockets.on happens when a client connects and turns on a connection event. It then takes a function of the socket that the user is asctually using. Reminds us of jQuery's document ready function.
io.sockets.on('connection', function(socket){
    // Receive message
    socket.on('send message', function(data){
        // When a user sends a message, we want it to go to all of the other users, because we're in a chat. This sends message to everyone including me.
        io.sockets.emit('new message', data);
    });
});






// view engine setup
app.set('views', path.join(__dirname, 'views'));

// Remove this below and replace with hogan engine
// app.set('view engine', 'jade');
app.set('view engine', 'hjs');
app.engine('html', require('hogan-express'));
app.set('view engine', 'html');

// 

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);


////////////////////////////////////////////////////
////////////////////////////////////////////////////

// CREATE API ENDPOINT AND SAVE TO MONGO ///////////////////////////////////
////////////////////////////////////////////////////////////////////////////

// create a mongoose model for message
var Message = mongoose.model('Message', { name: String, message: String });

// this one route has multiple HTTP methods (in this case GET and POST)
// this is an API endpoint to display messages as well a POSTing endpoint to add to the data collection
app.route('/message')

    // GET to view all message data
    .get(function (request, response) {

      // search the message collection for all documents
      Message.find()
      .exec(function (err, data) {
        console.log('in api');
        response.json(data);
      });
      
    })

    // this is where messages will be saved
    .post(function (request, response) {

      // let's see what data object we're passing to the POST
      console.log(request.body);

      // create a new instance of the Message model object
      var chatroomMessage = new Message({ name: request.body.name, message: request.body.message });

      // save this instance
      chatroomMessage.save(function (err) {
        if (err) console.log('message not saving due to: ', err);
        else console.log('name and message saved');
      });

    });

///////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////
////////////////////////////////////////////////////



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
