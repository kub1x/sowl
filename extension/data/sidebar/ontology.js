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

//-----------------------------------------------------------------------------

var Resource = function(uri) {
  logger.trace("constructor", arguments);
  this.uri = uri;
};

Resource.prototype.setUri = function setUri(uri) {
  logger.trace("start", arguments);
  this.uri = uri;
};

Resource.prototype.getUri = function getUri() {
  logger.trace("start", arguments);
  return this.uri;
};

Resource.prototype.addType = function addType(uri) {
  logger.trace("start", arguments);
  if(!this.types) {
    this.types = [];
  }
  this.types.push(uri);
};

Resource.prototype.setDomain = function setDomain(uri) {
  logger.trace("start", arguments);
  this.domain = uri;
};

Resource.prototype.getDomain = function getDomain() {
  logger.trace("start", arguments);
  return this.domain;
};

Resource.prototype.setRange = function setRange(uri) {
  logger.trace("start", arguments);
  this.range = uri;
};

Resource.prototype.getRange = function getRange() {
  logger.trace("start", arguments);
  return this.range;
};

//-----------------------------------------------------------------------------

/**
 *
 */
sowl.ontology = {

  /**
   * List of all loaded and/or created resources...
   */
  resources: {}, 

  /**
   *
   */
  putResource: function addResource(uri, resource) {
    logger.trace("start", arguments);
    this.resources[uri] = resource;
  }, 

  /**
   *
   */
  getResource: function getResource(uri) {
    logger.trace("start", arguments);
    return this.resources[uri]; 
  }, 

  /**
   *
   */
  getOrCreateResource: function getOrCreateResource(uri) {
    logger.trace("start", arguments);

    var resource = this.getResource(uri);
    if(!resource) {
      resource = new Resource(uri);
      this.putResource(uri, resource);
    }
    return resource;
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
   *
   */
  onLoadDrop: function onLoadDrop(event) {
    logger.trace("handle", arguments);

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
  loadRdfDocument: function loadRdfDocument(file) {
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
  showOntology: function showOntology() {
    logger.trace("start", arguments);

    //$('#ontology_list').empty();
  
    //sowl.ontology.listWhere('?target a ?type', function() {
    //  //show it somehow
    //});
    
    $.rdf({ databank: sowl.databank })
      .prefix('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
      .prefix('rdfs','http://www.w3.org/2000/01/rdf-schema#') 
      //.prefix('foaf','http://xmlns.com/foaf/0.1/')
      //.prefix('owl', 'http://www.w3.org/2002/07/owl#')
      .where('?target a ?type')
      .optional('?target rdfs:domain ?domain')
      .optional('?target rdfs:range  ?range')
      .each(function() {
        var resource = sowl.ontology.getOrCreateResource(this.target.value);
        if(this.type   !== undefined) { resource.addType(this.type.value); }
        if(this.domain !== undefined) { resource.setDomain(this.domain.value); }
        if(this.range  !== undefined) { resource.setRange(this.range.value); }
      });

    for ( key in this.resources ) {
      logger.debug("resource: " + key + ", " + JSON.stringify(this.resources[key], null, 2));
      $('#ontology_list').append('<div class="item bs-callout"><span class="uri">' + key + '</span></div>');
    }

      //  $('#ontology_list').append('<div class="item bs-callout"><span class="uri">'   + this.target.value + '</span>'
      //                                               + (this.type   === undefined ? '' : ('<br />' + 'type: '  + this.type.value))
      //                                               + (this.domain === undefined ? '' : ('<br />' + 'domain: '+ this.domain.value))
      //                                               + (this.range  === undefined ? '' : ('<br />' + 'range: ' + this.range.value))
      //                           + '</div>');
  
  },
  
  /**
   *
   */
  listWhere: function listWhere(condition, addOne) {
    logger.trace("start", arguments);

    $.rdf({ databank: sowl.databank })
      .prefix('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
      .prefix('rdfs','http://www.w3.org/2000/01/rdf-schema#') 
      .where(condition)
      .each(addOne);
  },

};
