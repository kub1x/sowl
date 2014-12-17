self.port.on('sowl-aardvark-start', function() {
  console.log('trace - got start-aardvark message - starting ardvark');
  _a.start();
  $('body').focus();
});

