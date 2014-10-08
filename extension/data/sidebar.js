addon.port.on('some-response', function(message) {
  $('div').text(message);
});

addon.port.emit('some-message');
