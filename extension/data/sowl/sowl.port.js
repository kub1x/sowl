
(function($, _s) {

  _s = _s || {};


  /**
   *
   */
  _s.port = {

    startSelection: function startSelection() {
      //logger.trace("start", arguments);
      logger.debug('sending message [sowl-selection-start]');
      addon.port.emit('sowl-selection-start');
    }, 

  };



  var handlers {

    onSelectionStarted : function onSelectionSelected(message){
      logger.debug('got message [sowl-selection-selected]:' + message);
    },
    
    onSelectionSelected : function onSelectionClicked(message){
      logger.debug('got message [sowl-selection-clicked]:' + message);
    }

  };


  _s.bindAll = function bindAll() {

    addon.port.on('sowl-selection-selected', handlers.onSelectionStarted);

    addon.port.on('sowl-selection-clicked', handlers.onSelectionClicked);

  }; 

})(jQuery, jQuery.sowl);
