// var socket = require('socket.io');



$(function(){
			//get our socket functionality ***
			var socket = io.connect();

			// grab our name input ****
			var name = $('#name');

			// grab our message form
			var messageForm = $('#send-message');

			// grab our message input
			var messageBox = $('#message');

			// grab our chat div
			var chat = $('#chat');



			//every time a message is submitted, we want to send our message to the server. Takes a function with an even at the parameter.
			messageForm.submit(function(e){

				var messageObject = {name: name.val(), message: messageBox.val()};

				// Prevent the default behavior of refreshing the page after you submit.
				e.preventDefault();

				// Send event to the server and use jquery to get the value of the name box and message box
				socket.emit('send message', messageObject);

				// clear the message box's value
				messageBox.val('');

				/////////////////////////////////////////////////////
				// jQuery AJAX call to POST message to mongo database
		    $.ajax({
		      type: "POST",
		      url: '/message',
		      data: messageObject,
		    });
		    /////////////////////////////////////////////////////
			});


			// Recieve the name and message on the client side
			socket.on('new message', function(data){
				console.log(data);
				// Display the message
				chat.append(data.name + ': ' + data.message + '<br>');
			});
		});
