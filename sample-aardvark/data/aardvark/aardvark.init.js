var aardvark = {
  isBookmarklet: true,

  loadObject: function  (obj) {
    for (var x in obj) {
      if (aardvark[x] == undefined) {
        aardvark[x] = obj[x];
      }
    }
  }, 

};

