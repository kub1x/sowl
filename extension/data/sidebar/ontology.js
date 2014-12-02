/** file: ontology.js */
logger.trace('ontology.js - begin');


/**
 * On document ready
 */
$(document).ready(function () {

  /**
   * Hook drag over to accept dropping. 
   */
  $('#ontology_droparea').on('dragover', sowl.ontology.onDroppableDragOver);
  $('#ontology_droparea').on('drop', sowl.ontology.onLoadDrop);
});


/**
 *
 */
sowl.ontology = {

  /**
   * This handler allows dropping on an element. 
   */
  onDroppableDragOver: function(event) {
    // Allow drop on file types
    if ($.inArray('application/x-moz-file', event.dataTransfer.types) != -1) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
    }
  },
  
  
  /**
   *
   */
  onLoadDrop: function(event) {
    logger.trace("start", arguments);

    event.preventDefault();

    var files = event.dataTransfer.files;
    for (var i = 0, file; file = files[i]; i++) {
      logger.debug('handling file: ' + file + '\n' + event.dataTransfer.types[i] + '\n' + 'JSON: ' + JSON.stringify(file, null, 2));
      sowl.ontology.loadRdfDocument(file);
    }
  }, 
  
  
  /**
   *
   */
  loadRdfDocument: function(file) {
    logger.trace("start", arguments);
  
    var reader = new FileReader();
  
    reader.onload =  function onload(event) {
      logger.trace("start", arguments);
  
      var xmlDoc = $.parseXML(event.target.result);
  
      // INIT sowl databank
      if ( sowl.databank == null) {
        sowl.rdf = $.rdf();
        sowl.databank = sowl.rdf.databank;
        logger.debug('initiated databank: ' + sowl.databank);
      }
      
      sowl.databank.load(xmlDoc);
  
      logger.debug('loaded databank: ' + sowl.databank.dump());
  
      sowl.ontology.showOntology();
    };
    
  
    reader.readAsText(file);
  },


  /**
   *
   */
  showOntology: function() {
    logger.trace("start", arguments, 'showOntology');

    $('#ontology_list').empty();
  
    //sowl.ontology.listWhere('?target a ?type', function() {
    //  //show it somehow
    //});
    $.rdf({ databank: sowl.databank })
      .prefix('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
      .prefix('rdfs','http://www.w3.org/2000/01/rdf-schema#') 
      .prefix('foaf','http://xmlns.com/foaf/0.1/')
      .prefix('owl', 'http://www.w3.org/2002/07/owl#')
      .where('?target a ?type')
      .optional('?target rdfs:domain ?domain')
      .optional('?target rdfs:range  ?range')
      .each(function() {
        $('#ontology_list').append('<div class="item"><span class="uri">'   + this.target.value + '</span>'
                                                     + (this.type   === undefined ? '' : ('<br />' + 'type: '  + this.type.value))
                                                     + (this.domain === undefined ? '' : ('<br />' + 'domain: '+ this.domain.value))
                                                     + (this.range  === undefined ? '' : ('<br />' + 'range: ' + this.range.value))
                                 + '</div>');
      });
  
  },
  
  
  /**
   *
   */
  listWhere: function(condition, addOne) {
    logger.trace("start", arguments, 'listWhere');

    $.rdf({ databank: sowl.databank })
      .prefix('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
      .prefix('rdfs','http://www.w3.org/2000/01/rdf-schema#') 
      .where(condition)
      .each(addOne);
  },

};
