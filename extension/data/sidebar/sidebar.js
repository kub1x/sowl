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

  
  /**
   * Accepting a map {String: uri -> Resource: resource}. 
   * Resource object is defined in ontology.js with following structure: 
   * {
   *  uri: jQuery.uri, 
   *  types: [ jQuery.uri ], 
   *  domain: jQuery.uri, 
   *  range: jQuery.uri, 
   * }
   *
   */
  showOntology: function showOntology(resources) {

    $('#ontology_list').empty();

    var elems = [];
    for ( uri in resources ) {
      var $elem = $('<div class="item bs-callout" draggable="true"><span class="uri">{0}</span></div>'.format(uri));

      //TODO do we need this stored here? 
      // Set the resource as property of the DOM node for later usage durign drag/drop etc...
      $elem.prop('resource', resources[uri]);

      // Set the URI not only as content (see higher) but aswell as the data-uri attribute (down here). 
      $elem.data('uri', uri);

      elems.push($elem);
    }

    $('#ontology_list').append(elems);
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

  //TODO XXX finish this dialog ;)
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

  /**
   * This handler allows dropping on an element. 
   */
  onDroppableDragOver: function onDroppableDragOver(event) {
    //logger.trace("handle", arguments);

    // Allow drop on file types
    if ($.inArray('application/x-moz-file', event.dataTransfer.types) != -1) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
    }
  },
  
  /**
   * Handles droping on ontology drop/load area. 
   */
  onLoadDrop: function onLoadDrop(event) {
    logger.trace("handle", arguments);

    event.preventDefault();

    var files = event.dataTransfer.files;
    for (var i = 0, file; file = files[i]; i++) {
      logger.debug('handling file: ' + file + '\n' + event.dataTransfer.types[i] + '\n' + 'JSON: ' + JSON.stringify(file, null, 2));
      sowl.ontology.loadRdfDocument(file, sowl.sidebar.showOntology);
    }
  }, 
  
  ontologyListItem_dragstart: function ontologyListItem_dragstart(event) {
    // this == event.target
    this.style.opacity = '0.4';

    event.dataTransfer.effectAllowed = 'sowl-drop-uri';
    // Setting JSON encoded resource definition as 
    event.dataTransfer.setData('sowl/resource-uri', $(this).data('uri'));

    //TODO START AARDVARK
    //TODO allow drop on document
  }, 

  ontologyListItem_dragend: function ontologyListItem_dragend(event) {
    this.style.opacity = '1';
  }, 

  //TODO temporary.. delme
  ontologyListItem_dragover: function ontologyListItem_dragover(event) {
    event.preventDefault(); // allows us to drop
    //this.className = 'over';
    event.dataTransfer.dropEffect = 'sowl-drop-uri';
    return false;
  }, 

  //TODO temporary.. delme
  ontologyListItem_drop: function ontologyListItem_drop(event) {
    event.stopPropagation(); // stops the browser from redirecting...why???
    console.log(event.dataTransfer.getData('sowl/resource-uri'));
  }, 


};

// Load
$(function() {
  logger.trace('attaching menu click event');

  // Menu click
  $('nav a').click(sowl.handlers.menuClick);

  // Filtering on ontology
  $('#ontology-filter').keyup(sowl.handlers.ontologyFilterKeyup);

  // Hook drag over to accept dropping. 
  $('#ontology_droparea').on('dragover', sowl.handlers.onDroppableDragOver);
  $('#ontology_droparea').on('drop',     sowl.handlers.onLoadDrop);

  $('#ontology_list').on('dragstart', '.item', sowl.handlers.ontologyListItem_dragstart);
  $('#ontology_list').on('dragend',   '.item', sowl.handlers.ontologyListItem_dragend);
  $('#ontology_list').on('dragover',  '.item', sowl.handlers.ontologyListItem_dragover);
  $('#ontology_list').on('drop',      '.item', sowl.handlers.ontologyListItem_drop);

  // Doubleclick on ontology
  $('#ontology_list').on('dblclick', '.item', sowl.handlers.ontologyListItemDblclick);

  // Panel hiding
  $('.panel-heading').click(sowl.handlers.panelHeadingClick);

  // Init scenario
  sowl.scenario.init();
  sowl.sidebar.currentTemplate = sowl.scenario.createTemplate('init');
  //sowl.sidebar.poulateTemplatesList();
  //TODO XXX !!!

});

