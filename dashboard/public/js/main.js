$(function() {
  // setup vars


  // get elts from DOM
  var $window = $(window);
  var $usernameInput = $('.usernameInput');
  var $messages = $('.messages');
  var $inputMessage = $('.inputMessage');
  

  socket.on('reconnect', () => {
    console.log('You have been reconnected');
    if (username) {
      socket.emit('add user', username);
    }
  });

  socket.on('reconnect_error', () => {
    console.log('Attempt to reconnect has failed');
  });


});
