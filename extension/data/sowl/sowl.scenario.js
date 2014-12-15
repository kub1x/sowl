jQuery.sowl = (function(_s){
  if (!_s) _s = {};

  _s.scenario = function scenario() {
    return new _s.scenario.fn.init();
  };

  _s.scenario.fn = _s.scenario.prototype = {


    init: function init() {
      logger.trace('created[scenario]', arguments);
      this.templates = [];
    }, 

    createTemplate = function createTemplate(name) {
      logger.trace('called', arguments);
      var template = _s.template(name);
      this.templates[name] = template;
      return template;
    },
    
    getTemplate = function getTemplate(name) {
      logger.trace('called', arguments);
      return this.templates[name];
    },
    
    removeTemplate = function removeTemplate(name) {
      logger.trace('called', arguments);
      delete this.templates[name];
    },

  };

  _s.scenario.fn.init.prototype = _s.scenario.fn;
  
  //---------------------------------------------------------------------------
  
  _s.template = function template(name) {
    logger.trace('created[sowl.template]', arguments);
    return new _s.template.fn.init(name);
  }; 

  _s.template.fn = _s.template.prototype = {

    /**
     *
     */
    init: function init(name) {
      logger.trace('called', arguments);
      this.name = name;
      //TODO create root step!!
    },

  };

  //---------------------------------------------------------------------------



  
  return _s;
})(jQuery.sowl);
