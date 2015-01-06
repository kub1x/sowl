
self.port.on('sowl-aardvark-start', function() {
  console.log('trace - got start-aardvark message - starting ardvark');
  aardvark.start();
  $('body').focus();
});

self.port.on('sowl-aardvark-context', function(context) {
  aardvark.contextSelector = context;
});
