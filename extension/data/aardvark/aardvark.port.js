
self.port.on('sowl-aardvark-start', function() {
  console.log('trace - got start-aardvark message - starting ardvark');
  aardvark.start();
  $('body').focus();
});

