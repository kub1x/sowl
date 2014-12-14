/**
 * @fileOverview Base jQuery module for sowl
 * @author <a href="mailto:j.podlaha@gmail.com">Jakub kub1x Podlaha</a>
 * @copyright (c) 2014, Jakub kub1x Podlaha
 * @license MIT license (MIT-LICENSE.txt)
 * @version 1.0
 * @requires jquery.js
 */
(function($) {

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

    'http://www.w3.org/2002/07/owl#InverseFunctionalProperty', 
  ];
  
  /**
   * Determine if type is Property type. 
   *
   * NOTE jQuery.uri.toString() returns the contained URI as string.
   *
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
  $.sowl.resource = function resource (uri, type, domain, range) {
    return new $.sowl.resource.fn.init(uri, type, domain, range);
  };


  //
  // Public -------------------------------------------------------------------

  /**
   * jQuery.sowl capabilities. 
   */
  $.sowl.resource.fn = $.sowl.resource.prototype = {

    /**
     *
     */
    init: function init(uri, type, domain, range) {
      this.setUri(uri);
      this.addType(type);
      this.setDomain(domain);
      this.setRange(range);
      return this;
    },

    getUri: function getUri(){
      return urify(this.uri);
    }, 

    setUri: function setUri(uri) {
      this.uri = unurify(uri);
    }, 

    getDomain: function getDomain() {
      return urify(this.domain);
    }, 

    setDomain: function setDomain(domain) {
      this.domain = unurify(domain);
    }, 

    getRange: function getRange() {
      return urify(this.range);
    }, 

    setRange: function setRange(range) {
      this.range = unurify(range);
    }, 

    isProperty: function isProperty() {
      for (var i in this.types) {
        if(isPropertyTypeUri(this.types[i])){
          return true;
        }
      }
      return false;
    }, 

    isType: function isType(type) {
      return ($.inArray(unurify(type), this.types) != -1);
    }, 

    addType: function addType(type) {
      // For array add one by one...
      if (type instanceof Array) {
        for (var i in type) {
          this.addType(type[i]);
        }
      }

      // Assure we do have the array
      if(!this.types) {
        this.types = [];
      }

      this.types.push(unurify(type));
    }, 


  };

  $.sowl.resource.fn.init.prototype = $.sowl.resource.fn;


  //
  // Static -------------------------------------------------------------------

  //$.sowl.resource.parent = $.sowl;

  //$.sowl.resource.defaults = {
  //  uri: null, 
  //  domain: null, 
  //  range: null, 
  //  types: [], 
  //};


})(jQuery);

