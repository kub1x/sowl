jQuery.sowl = (function($, _s){

  // Init namespace, if needed. 
  _s = _s || {};

  _s.scenario = function scenario() {
    logger.trace('called', arguments);
    return new _s.scenario.fn.init();
  };

  _s.scenario.fn = _s.scenario.prototype = {

    /**
     * Scenarion consturctor. 
     */
    init: function init() {
      logger.trace('created[scenario]', arguments);
    }, 

    getTemplates: function getTemplates() {
      logger.trace('called', arguments);
      return this.templates = this.templates || [];
    }, 

    createTemplate: function createTemplate(name) {
      logger.trace('called', arguments);
      var template = _s.template(name);
      this.putTemplate(name, template);
      return template;
    },

    putTemplate: function putTemplate(name, template) {
      logger.trace('called', arguments);
      this.getTemplates()[name] = template;
    }, 
    
    getTemplate: function getTemplate(name) {
      logger.trace('called', arguments);
      return this.templates[name];
    },
    
    removeTemplate: function removeTemplate(name) {
      logger.trace('called', arguments);
      delete this.templates[name];
    },

  };

  _s.scenario.fn.init.prototype = _s.scenario.fn;
  
  //---------------------------------------------------------------------------
  
  _s.template = function template(name) {
    logger.trace('called', arguments);
    return new _s.template.fn.init(name);
  }; 

  _s.template.fn = _s.template.prototype = {

    /**
     * Template constructor. 
     */
    init: function init(name) {
      logger.trace('created[sowl.template]', arguments);
      this.name = name;
    },

    getName: function getName() {
      logger.trace('called', arguments);
      return this.name;
    }, 

    /**
     * WARNING: name serves as the identificator for the template on
     * many places. Changing it may result in inconsistencies. 
     */
    setName: function setName(name) {
      logger.trace('called', arguments);
      logger.warn('Name serves as the identificator for the template on many places. Changing it may result in inconsistencies. ');
      this.name = name;
    }, 

  };

  _s.template.fn.init.prototype = _s.template.fn;

  //---------------------------------------------------------------------------
  
  return _s;

})(jQuery, jQuery.sowl);
