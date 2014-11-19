// sidebar.js //

logger.trace('sidebar.js - file begin');

/**
 * Object storing all the bloody structures of sowl. 
 */
var sowl = {
  rdf: null, 
  databank: null, 
  scenario: null, 
};

sowl.sidebar = {

  menuClick: function menuClick(selected, event) {
    logger.trace("start", arguments);
    this.hideAll();
    this.show(selected);
  },

  show: function(id) {
    //TODO move ID's into resources (somehow..?)
    $('#content #'+id).removeClass('hidden');
    $('#menu_'+id).addClass('current');
  },

  hideAll: function() {
    $('#menu').children().removeClass('current');
    $('#content').children().addClass('hidden');
  },

  startSelection: function() {
    logger.trace("start", arguments);
    //TODO this should start aardvark on current tab
    //TODO move message name into resources
    addon.port.emit('sowl-start-selection');
  },

};

// Load
$(function() {
  logger.trace('attaching click event');
  $('nav a').click(function(event){
    event.preventDefault();
    //TODO move attribut name into resources
    var selected = $(this).attr('data-menu-target');
    logger.trace('clicked selected: ' + selected);
    sowl.sidebar.menuClick(selected, event.originalEvent);
  });
});

