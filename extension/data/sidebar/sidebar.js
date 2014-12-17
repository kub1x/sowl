// sidebar.js //

logger.trace('sidebar.js - file begin');

/**
 * Object storing all the bloody structures of sowl. 
 */
var sowl = {
  rdf: null, 
  databank: null, 
  scenario: null, 
  resources: {}, 
};

sowl.sidebar = {

  //TODO XXX !!!
  currentTemplate: null, 
  currentStep: null, 

  /**
   *
   */
  populateTemplatesList: function populateTemplatesList() {
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

    sowl.resources = resources;

    $('#ontology_list').empty();

    var elems = [];
    for ( uri in resources ) {
      var $elem = $('<div class="item" draggable="true"><span class="uri">{0}</span></div>'.format(uri));

      // Set the resource as property of the DOM node for later usage durign drag/drop etc...
      //$elem.prop('resource', resources[uri]);

      // Set the URI not only as content (see higher) but aswell as the data-uri attribute (down here). 
      $elem.data('uri', uri);

      elems.push($elem);
    }

    $('#ontology_list').append(elems);
  }, 

  /**
   * Expecting element in form:
   * <code>
   * <div class="item" draggable="true">
   *   <span class="uri" data-uri="the://uri.to/be#edited">the://uri.to/be#edited</span>
   * </div>
   * </code>
   */
  createResourceEditor: function createResourceEditor($elem) {
    var uri = $elem.data('uri'),
        resource = sowl.resources['uri'],
        $text, $ok, $cancel;

    //TODO refactor, make methods for adding and deleting resources..? 

    function ok() {
      console.log('ok on uri: {0}'.format(uri));
      // TODO theroretically no need to unbind..?
      var new_uri = $text.val();
      if(new_uri === '') {
        delete sowl.resources[uri];
        $elem.remove();
      } else {
        delete sowl.resources[uri];
        //TODO XXX this is not pure uri object!!
        //         this is SPARTA!! eee.. this: 
        //{
        // uri: jQuery.uri, 
        // types: [ jQuery.uri ], 
        // domain: jQuery.uri, 
        // range: jQuery.uri, 
        //}
        sowl.resources[new_uri] = jQuery.uri(new_uri);
        $elem.data('uri', new_uri);
        $elem.html('<span class="uri">{0}</span></div>'.format(new_uri));
      }
      // TODO theroretically no need to redraw ;) Unless we want to re-sort the whole thing. 
    };

    function cancel() {
      console.log('cancel on uri: {0}'.format(uri));
      // Delete if still empty
      if(typeof uri === 'undefined' || uri === '') {
        $elem.remove();
      } else {
        $elem.html('<span class="uri">{0}</span></div>'.format(uri));
      }
    };


    // Create input[type=text]
    $text = $('<input name="uri" type="text" />');
    $text.val(uri);
    $text.bind('keydown.ctrl_enter', ok);
    $text.bind('keydown.esc', cancel);
    //TODO on Ctrl+Enter -> Submit
    //TODO on Ctrl+Esc -> Cancel

    // Create the OK button
    $ok = $('<button class="ok">OK</button>');
    $ok.click(ok);

    // Create the Cancel button
    $cancel = $('<button class="cancel">Cancel</button>');
    $cancel.click(cancel);

    $elem.html([$text, $ok, $cancel]);

    //var $elem = $('<div class="item" draggable="true"><span class="uri">{0}</span></div>'.format(uri));
  }, 

};

/**
 *
 */
sowl.handlers = {

  ///**
  // *
  // */
  //menuClick: function menuClick(event){
  //  //logger.trace('triggered', arguments);
  //  event.preventDefault();
  //  var $this = $(this);
  //  var selected = $this.attr('data-menu-target');
  //  logger.trace('clicked selected: ' + selected);
  //  sowl.sidebar.hideAll();
  //  sowl.sidebar.show(selected);
  //  $this.blur();
  //}, 

  /**
   *
   */
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

  /**
   *
   */
  panelHeadingClick: function panelHeadingClick(event){
    //console.trace('clicked heading');
    var $panel = $(this).closest('.panel');
    $panel.toggleClass('collapsed');
  }, 

  /**
   *
   */
  ontologyListItem_dblclick: function ontologyListItem_dblclick(event) {
    //TODO cancel any previously opened editors? 
    sowl.sidebar.createResourceEditor($(this)); 
  }, 

  /**
   *
   */
  ontologyListItem_click: function ontologyListItem_click(event) {
    event.preventDefault();

    $('#ontology_list .item').removeClass('selected');
    $(this).addClass('selected');

    return false;
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

    $('#ontology').removeClass('dragover');

    var files = event.dataTransfer.files;
    for (var i = 0, file; file = files[i]; i++) {
      logger.debug('handling file: ' + file + '\n' + event.dataTransfer.types[i] + '\n' + 'JSON: ' + JSON.stringify(file, null, 2));
      sowl.ontology.loadRdfDocument(file, sowl.sidebar.showOntology);
    }
  }, 
  
  /**
   *
   */
  ontologyListItem_dragstart: function ontologyListItem_dragstart(event) {
    // this == event.target
    this.style.opacity = '0.4';

    event.dataTransfer.effectAllowed = 'sowl-drop-uri';
    // Setting JSON encoded resource definition as 
    event.dataTransfer.setData('sowl/resource-uri', $(this).data('uri'));

    //TODO START AARDVARK
    //TODO allow drop on document
  }, 

  /**
   *
   */
  ontologyListItem_dragend: function ontologyListItem_dragend(event) {
    this.style.opacity = '1';
  }, 

  /**
   *
   */
  ontologyListItem_dragover: function ontologyListItem_dragover(event) {
    event.preventDefault(); // allows us to drop
    //this.className = 'over';
    event.dataTransfer.dropEffect = 'sowl-drop-uri';
    return false;
  }, 

  /**
   *
   */
  ontologyListItem_drop: function ontologyListItem_drop(event) {
    event.stopPropagation(); // stops the browser from redirecting...why???
    console.log(event.dataTransfer.getData('sowl/resource-uri'));
  }, 

  /**
   *
   */
  ontologyAdd_click: function ontologyAdd_click(event) {
    var $elem = $('<div class="item" draggable="true"></div>');
    sowl.sidebar.createResourceEditor($elem);
    $('#ontology_list').prepend($elem);
  },

};

// Load
$(function() {
  logger.trace('attaching menu click event');

  // Menu click
  //$('nav a').click(sowl.handlers.menuClick);

  // Filtering on ontology
  $('#ontology-filter').keyup(sowl.handlers.ontologyFilterKeyup);

  // Hook drag over to accept dropping. 
  $('#ontology').on('dragover', function(){ $(this).addClass('dragover'); });
  $('#ontology').on('dragleave', function(){ $(this).removeClass('dragover'); });

  $('#ontology_droparea').on('dragover', sowl.handlers.onDroppableDragOver);
  $('#ontology_droparea').on('drop',     sowl.handlers.onLoadDrop);

  $('#ontology_list').on('dragstart', '.item', sowl.handlers.ontologyListItem_dragstart);
  $('#ontology_list').on('dragend',   '.item', sowl.handlers.ontologyListItem_dragend);
  $('#ontology_list').on('dragover',  '.item', sowl.handlers.ontologyListItem_dragover);
  $('#ontology_list').on('drop',      '.item', sowl.handlers.ontologyListItem_drop);

  // Doubleclick on ontology
  $('#ontology_list').on('dblclick', '.item', sowl.handlers.ontologyListItem_dblclick);
  $('#ontology_list').on('click', '.item', sowl.handlers.ontologyListItem_click);
  $('#ontology-add').click(sowl.handlers.ontologyAdd_click);

  // Panel hiding
  $('.panel-heading').click(sowl.handlers.panelHeadingClick);

  // Init scenario
  $('#scenario').scenario();
  //sowl.scenario.init();
  //sowl.sidebar.currentTemplate = sowl.scenario.createTemplate('init');
  //sowl.sidebar.poulateTemplatesList();
  //TODO XXX !!!

});

