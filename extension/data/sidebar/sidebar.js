(function($, sowl) {
  logger.trace('sidebar.js - file begin');

  /**
   * Object storing all the bloody structures of sowl. 
   */
  $.sowl = $.sowl || {
    rdf: null, 
    databank: null, 
    scenario: null, 
    resources: {}, 
  };

  $.sowl.sidebar = {

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

      $.sowl.resources = $.sowl.resources || [];
      $.sowl.resources = $.sowl.resources.concat(resources);

      $('#ontology_list').empty();

      var cachedElems = [], 
          $elem, uri; 

      for (uri in resources) {
        var $elem = $('<div class="item" draggable="true"><span class="uri">{0}</span></div>'.format(uri));

        // Set the resource as property of the DOM node for later usage durign drag/drop etc...
        //$elem.prop('resource', resources[uri]);

        // Set the URI not only as content (see higher) but aswell as the data-uri attribute (down here). 
        $elem.data('uri', uri);

        cachedElems.push($elem);
      }

      $('#ontology_list').append(cachedElems);
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
      resource = $.sowl.resources['uri'],
      $text, $ok, $cancel;

      function ok() {
        var new_uri = $text.val();
        if(new_uri === '') {
          delete $.sowl.resources[uri];
          $elem.remove();
        } else {
          delete $.sowl.resources[uri];
          $.sowl.resources[new_uri] = jQuery.uri(new_uri);
          $elem.data('uri', new_uri);
          $elem.html('<span class="uri">{0}</span></div>'.format(new_uri));
        }
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

      // Create the OK button
      $ok = $('<button class="ok">OK</button>');
      $ok.click(ok);

      // Create the Cancel button
      $cancel = $('<button class="cancel">Cancel</button>');
      $cancel.click(cancel);

      $elem.html([$text, $ok, $cancel]);
    }, 

  };

  /**
   *
   */
  var handlers = {

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
      $.sowl.sidebar.createResourceEditor($(this)); 
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
        $.sowl.ontology.loadRdfDocument(file, $.sowl.sidebar.showOntology);
      }
    }, 

    /**
     *
     */
    ontologyListItem_dragstart: function ontologyListItem_dragstart(event) {
      this.style.opacity = '0.4';

      var img = document.createElement('img');
      img.src = '../icons/rdf_blue.png';

      event.dataTransfer.effectAllowed = 'linkMove';
      // Setting JSON encoded resource definition as 
      event.dataTransfer.setData('sowl/resource-uri', $(this).data('uri'));
      event.dataTransfer.setDragImage(img, -5, -5);
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
    ontologyAdd_click: function ontologyAdd_click(event) {
      var $elem = $('<div class="item" draggable="true"></div>');
      $.sowl.sidebar.createResourceEditor($elem);
      $('#ontology_list').prepend($elem);
    },

  };

  // Load
  $(function() {
    logger.trace('attaching menu click event');

    // Filtering on ontology
    $('#ontology-filter').keyup(handlers.ontologyFilterKeyup);

    // Hook drag over to accept dropping. 
    $('#ontology').on('dragover', function(){ $(this).addClass('dragover'); });
    $('#ontology').on('dragleave', function(){ $(this).removeClass('dragover'); });

    $('#ontology_droparea').on('dragover', handlers.onDroppableDragOver);
    $('#ontology_droparea').on('drop',     handlers.onLoadDrop);

    $('#ontology_list').on('dragstart', '.item', handlers.ontologyListItem_dragstart);
    $('#ontology_list').on('dragend',   '.item', handlers.ontologyListItem_dragend);
    $('#ontology_list').on('dragover',  '.item', handlers.ontologyListItem_dragover);
    $('#ontology_list').on('drop',      '.item', handlers.ontologyListItem_drop);

    // Doubleclick on ontology
    $('#ontology_list').on('dblclick', '.item', handlers.ontologyListItem_dblclick);
    $('#ontology_list').on('click', '.item', handlers.ontologyListItem_click);
    $('#ontology-add').click(handlers.ontologyAdd_click);

    // Panel hiding
    $('.panel-heading').click(handlers.panelHeadingClick);

    // Init scenario
    $('#scenario').scenario();

    $.sowl.port.bindAll();
    $.sowl.port.startSelection();

  });


})(jQuery, jQuery.sowl); 
