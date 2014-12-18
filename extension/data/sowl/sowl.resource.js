/**
 * @fileOverview Base jQuery module for sowl.resource
 * @author <a href="mailto:j.podlaha@gmail.com">Jakub kub1x Podlaha</a>
 * @copyright (c) 2014, Jakub kub1x Podlaha
 * @license MIT license (MIT-LICENSE.txt)
 * @version 1.0
 * @requires jquery.js
 */
jQuery.sowl = (function($, _s) {

  _s = _s || {};

  //
  // Private ------------------------------------------------------------------
  
  /**
   * Convert string into jQuery.uri. 
   */
  function urify(str) {
    if(str instanceof jQuery.uri) { return str; }
    else { return jQuery.uri(str); }
  };

  /**
   * Convert jQuery.uri into string. 
   * NOTE jQuery.uri.toString() returns the contained URI as string.
   */
  function unurify(str) {
    if(str instanceof jQuery.uri) { return str.toString(); }
    else { return str; }
  };

  var PROPERTY_TYPES = [
    'http://www.w3.org/1999/02/22-rdf-syntax-ns#Property',
    'http://www.w3.org/2002/07/owl#ObjectProperty', 
    'http://www.w3.org/2002/07/owl#DatatypeProperty', 
    'http://www.w3.org/2002/07/owl#AnnotationProperty', 
    //'http://www.w3.org/2002/07/owl#InverseFunctionalProperty', 
  ];
  
  /**
   * Determine if type is Property type. 
   * @return true if URI passed defines a property type. 
   */
  function isPropertyTypeUri(uri) {
    return ($.inArray(unurify(uri), PROPERTY_TYPES) != -1); 
  }

  //
  // Constructor/basic object -------------------------------------------------

  /**
   * Create jQuery.sowl object. 
   */
  _s.resource = function resource (uri, type, domain, range) {
    logger.trace('called', arguments);
    return new _s.resource.fn.init(uri, type, domain, range);
  };


  //
  // Public -------------------------------------------------------------------

  /**
   * jQuery.sowl capabilities. 
   */
  _s.resource.fn = _s.resource.prototype = {

    /**
     * The resource constructor. 
     */
    init: function init(uri, type, domain, range) {
      //logger.trace('created[sowl.resource]', arguments);
      this.setUri(uri);
      this.addType(type);
      this.setDomain(domain);
      this.setRange(range);
      return this;
    },

    getUri: function getUri(){
      //logger.trace('called', arguments);
      return urify(this.uri);
    }, 

    setUri: function setUri(uri) {
      //logger.trace('called', arguments);
      this.uri = unurify(uri);
    }, 

    getDomain: function getDomain() {
      //logger.trace('called', arguments);
      return urify(this.domain);
    }, 

    setDomain: function setDomain(domain) {
      //logger.trace('called', arguments);
      this.domain = unurify(domain);
    }, 

    getRange: function getRange() {
      //logger.trace('called', arguments);
      return urify(this.range);
    }, 

    setRange: function setRange(range) {
      //logger.trace('called', arguments);
      this.range = unurify(range);
    }, 

    isProperty: function isProperty() {
      //logger.trace('called', arguments);
      for (var i in this.types) {
        if(isPropertyTypeUri(this.types[i])){
          return true;
        }
      }
      return false;
    }, 

    isType: function isType(type) {
      //logger.trace('called', arguments);
      return ($.inArray(unurify(type), this.types) != -1);
    }, 

    getTypes: function getTypes() {
      //logger.trace('called', arguments);
      return this.types = this.types || [];
    }, 

    addType: function addType(type) {
      //logger.trace('called', arguments);

      // For array add one by one...
      if (type instanceof Array) {
        type.forEach(this.addType, this);
      }

      this.getTypes().push(unurify(type));
    }, 


  };

  _s.resource.fn.init.prototype = _s.resource.fn;

  //---------------------------------------------------------------------------

  return _s;

})(jQuery, jQuery.sowl);

