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
    $('#menu [data-menu-target='+id+']').addClass('current');
  },

  hideAll: function() {
    $('#menu').children().removeClass('current');
    $('#content').children().addClass('hidden');
  },

  startSelection: function() {
    logger.trace("start", arguments);

    addon.port.on('sowl-selection-selected', function(message){
      logger.debug('got message [sowl-selection-selected]:' + message);
    });

    addon.port.on('sowl-selection-clicked', function(message){
      logger.debug('got message [sowl-selection-clicked]:' + message);
    });

    //TODO this should start aardvark on current tab
    //TODO move message name into resources
    addon.port.emit('sowl-selection-start');
  },

};

// Load
$(function() {
  logger.trace('attaching menu click event');

  // Menu click
  $('nav a').click(function(event){
    event.preventDefault();
    var selected = $(this).attr('data-menu-target');
    logger.trace('clicked selected: ' + selected);
    sowl.sidebar.menuClick(selected, event.originalEvent);
    $(this).blur();
  });

  // Filtering on ontology
  $('#ontology-filter').keyup(function(event){
    var val = $(this).val().toLowerCase();

    // reset on zero value
    if (val === '') {
      $('#ontology_list').children('.item').removeClass('hidden');
      return;
    }

    $('#ontology_list').children('.item').each(function(index, element){
      var $elem = $(element);
      var text = $elem.find('.uri').text().toLowerCase();
      if (text.indexOf(val) > -1) {
        $elem.removeClass('hidden');
      } else {
        $elem.addClass('hidden');
      }
    });


  });

  // Panel hiding
  $('.panel-heading').click(function(event){
    console.log('clicked heading');
    var $panel = $(this).parent();
    $panel.toggleClass('collapsed');
  });
});

