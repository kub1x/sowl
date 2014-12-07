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

  //TODO XXX !!!
  currentTemplate: null, 
  currentStep: null, 


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

  populateTemplatesList: function() {
    //TODO XXX !!!
  }, 

};

sowl.handlers = {

  menuClick: function menuClick(event){
    //logger.trace('triggered', arguments);

    event.preventDefault();
    var $this = $(this);

    var selected = $this.attr('data-menu-target');
    logger.trace('clicked selected: ' + selected);

    sowl.sidebar.hideAll();
    sowl.sidebar.show(selected);

    $this.blur();
  }, 

  ontologyFilterKeyup: function ontologyFilterKeyup(event){
    //logger.trace('triggered', arguments);

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
  }, 

  panelHeadingClick: function panelHeadingClick(event){
    //console.trace('clicked heading');
    var $panel = $(this).closest('.panel');
    $panel.toggleClass('collapsed');
  }, 

  ontologyListItemDblclick: function ontologyListItemDblclick(event) {
    bootbox.dialog({
      title: "This is a form in a modal.",
      message: '<div class="row"> ' +
        '<div class="col-md-12"> ' +
        '<form class="form-horizontal"> ' +
        '<div class="form-group"> ' +
        '<label class="col-md-4 control-label" for="name">Name</label> ' +
        '<div class="col-md-4"> ' +
        '<input id="name" name="name" type="text" placeholder="Your name" class="form-control input-md"> ' +
        '<span class="help-block">Here goes your name</span> </div> ' +
        '</div> ' +
        '<div class="form-group"> ' +
        '<label class="col-md-4 control-label" for="awesomeness">How awesome is this?</label> ' +
        '<div class="col-md-4"> <div class="radio"> <label for="awesomeness-0"> ' +
        '<input type="radio" name="awesomeness" id="awesomeness-0" value="Really awesome" checked="checked"> ' +
        'Really awesome </label> ' +
        '</div><div class="radio"> <label for="awesomeness-1"> ' +
        '<input type="radio" name="awesomeness" id="awesomeness-1" value="Super awesome"> Super awesome </label> ' +
        '</div> ' +
        '</div> </div>' +
        '</form> </div> </div>',
      buttons: {
        success: {
          label: "Save",
          className: "btn-success",
          callback: function () {
            var name = $('#name').val();
            var answer = $("input[name='awesomeness']:checked").val()
              Example.show("Hello " + name + ". You've chosen <b>" + answer + "</b>");
          }
        }
      }
    }); 
  }, 

};

// Load
$(function() {
  logger.trace('attaching menu click event');

  // Menu click
  $('nav a').click(sowl.handlers.menuClick);

  // Filtering on ontology
  $('#ontology-filter').keyup(sowl.handlers.ontologyFilterKeyup);

  // Doubleclick on ontology
  $(document).on("dblclick", "#ontology_list .item", sowl.handlers.ontologyListItemDblclick);

  // Panel hiding
  $('.panel-heading').click(sowl.handlers.panelHeadingClick);

  // Init scenario
  sowl.scenario.init();
  sowl.sidebar.currentTemplate = sowl.scenario.createTemplate('init');
  sowl.sidebar.populateTemplatesList();
  //TODO XXX !!!

});

