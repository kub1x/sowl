/**
 * @fileOverview $ jQuery.sowl
 * @author <a href="mailto:podlajak@fel.cvut.cz">Jakub kub1x Podlaha</a>
 * @copyright (c) 2014,2015 Jakub Podlaha
 * @license MIT license
 * @version 0.1
 */
/** @namespace */
jQuery.sowl = (function($, _s) {

  // Init namespace, if needed. 
  _s = _s || {};

  /**
   * @class
   * @name scenario
   * @description $.sowl is a namespace for the SOWL project.
   *   $.sowl.scenario it's inner representation for scenario
   *   used by crOWLer - the semantic crawler. 
   */
  /**
   * Creates new {@link jQuery.sowl.scenario} object. 
   * Simply calls the jQuery.sowl.scenario.fn.init() constructor. 
   */
  _s.scenario = function scenario() {
    logger.trace('called', arguments);
    return new _s.scenario.fn.init();
  };

  _s.scenario.fn = _s.scenario.prototype = {

    /**
     * Represents scenario. The js representation of the actual
     * scenario.json to be used by crOWLer. 
     * @constructor
     */
    init: function init() {
      logger.trace('created[scenario]', arguments);
      this.name = 'unnamed';
      this.createTemplate('init');
    }, 

    getName: function getName() {
      return this.name;
    }, 

    setName: function setName(name) {
      this.name = name;
    }, 

    /**
     * Getter for an array of {@link jQuery.sowl.template}. 
     * This should be used internally only. 
     * Lazy initialized. 
     * @returns Array of stored [template]{@link jQuery.sowl.template}s. 
     */
    getTemplates: function getTemplates() {
      logger.trace('called', arguments);
      return this.templates = this.templates || {};
    }, 

    /**
     * Getter for an array containing names of all templates. 
     * This should be used to show list of templates. 
     * @returns Array of names of stored [template]{@link jQuery.sowl.template}s. 
     */
    getTemplatesNames: function getTemplatesNames() {
      return Object.keys(this.getTemplates()); 
    }, 

    /**
     * Getter returning template by name. 
     * @returns [Template]{@link jQuery.sowl.template} by it's name. 
     */
    getTemplate: function getTemplate(name) {
      logger.trace('called', arguments);
      return this.getTemplates()[name];
    },
    
    /**
     * Putter storing template by name. 
     */
    putTemplate: function putTemplate(name, template) {
      logger.trace('called', arguments);
      this.getTemplates()[name] = template;
      //OR
      //var tmps = this.getTemplates(), 
      //    orig = tmps[name];
      //tmps[name] = template;
      //return orig;
    }, 
    
    /**
     * Removes template by name. 
     */
    removeTemplate: function removeTemplate(name) {
      logger.trace('called', arguments);
      delete this.getTemplates()[name];
    },

    /**
     * Creates empty template, stores it by name and returns it. 
     * @param {string} name - Name of the new template. 
     * @returns The newly created [template]{@link jQuery.sowl.template}. 
     */
    createTemplate: function createTemplate(name) {
      logger.trace('called', arguments);
      var template = _s.template(name);
      this.putTemplate(name, template);
      return template;
    },

  };

  _s.scenario.fn.init.prototype = _s.scenario.fn;
  
  return _s;

})(jQuery, jQuery.sowl);
