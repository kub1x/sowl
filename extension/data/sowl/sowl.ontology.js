logger.trace('sowl.ontology.js - begin');

$.sowl = $.sowl || {};
$.sowl.ontology = {

  /**
   * List of all loaded and/or created resources...
   */
  resources: {}, 

  putResource: function addResource(uri, resource) {
    this.resources[uri] = resource;
  }, 

  getResource: function getResource(uri) {
    return this.resources[uri]; 
  }, 

  getOrCreateResource: function getOrCreateResource(uri) {
    var resource = this.getResource(uri);
    if(!resource) {
      resource = $.sowl.resource(uri);
      this.putResource(uri, resource);
    }
    return resource;
  },

  loadRdfDocument: function loadRdfDocument(file, gui_callback) {
    logger.trace("start", arguments);
    var reader = new FileReader();
    reader.onload =  function onload(event) {
      logger.trace("start", arguments);
      var xmlDoc = $.parseXML(event.target.result);
      if ( $.sowl.databank == null) {
        $.sowl.rdf = $.rdf();
        $.sowl.databank = $.sowl.rdf.databank;
      }
      $.sowl.databank.load(xmlDoc);
      $.sowl.ontology.showOntology(gui_callback);
    };
    reader.readAsText(file);
  },

  showOntology: function showOntology(gui_callback) {
    logger.trace("start", arguments);

    $.rdf({ databank: $.sowl.databank })
      .prefix('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
      .prefix('rdfs','http://www.w3.org/2000/01/rdf-schema#') 
      .where('?target a ?type')
      .optional('?target rdfs:domain ?domain')
      .optional('?target rdfs:range  ?range')
      .each(function() {
        var resource = $.sowl.ontology.getOrCreateResource(this.target.value);
        if(this.type   !== undefined) { resource.addType(this.type.value); }
        if(this.domain !== undefined) { resource.setDomain(this.domain.value); }
        if(this.range  !== undefined) { resource.setRange(this.range.value); }
      });

    if ( gui_callback ) {
      gui_callback($.sowl.ontology.resources);
    }
  },
  
};

