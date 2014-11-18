$(function(){

  $.contextMenu({
    selector: 'body', //'.sowl-context-menu', 
    trigger: 'left',
    callback: function(key, options) {
      var m = key;
      console.log('sending [context-menu-clicked]: ' + m);
      self.port.emit('context-menu-clicked', m);
      return true;
    },
    items: {
      "select":  {name: "Select"},
      "doclick": {name: "Perform Click"},
      "sep1": "---------",
    }
  });

});
