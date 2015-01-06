(function($, _s) {
  _s = _s || {};
  _s.port = {

    startSelection: function startSelection() {
      logger.trace("start", arguments);
      logger.debug('sending message [sowl-selection-start]');
      addon.port.emit('sowl-selection-start');
    }, 

    bindAll: function bindAll() {
      logger.trace('start', arguments);
      addon.port.on('sowl-selection-selected', handlers.onSelectionStarted);
      addon.port.on('sowl-selection-clicked', handlers.onSelectionClicked);
      addon.port.on('sowl-selection-dropped', handlers.onSelectionDropped);
    }, 

    callContext: function callContext( contextSelector ) {
      console.log('calling [sowl-scenario-context]: ' + contextSelector);
      addon.port.emit('sowl-selection-context', contextSelector);
    }, 

    callScenarioSave: function callScenarioSave(scenario_data) {
      console.log('calling [sowl-scenario-save]');
      addon.port.emit('sowl-scenario-save', scenario_data);
    }, 

  };

  var handlers = {

    onSelectionStarted : function onSelectionSelected(message){
      logger.debug('got message [sowl-selection-selected]:' + message);
    },
    
    onSelectionSelected : function onSelectionClicked(message){
      logger.debug('got message [sowl-selection-clicked]:' + message);
    }, 

    onSelectionDropped : function onSelectionDropped(message){
      logger.debug('got message [sowl-selection-dropped]:' + message);
    }, 

  };

})(jQuery, jQuery.sowl);
