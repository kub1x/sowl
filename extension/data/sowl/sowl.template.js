jQuery.sowl = (function($, _s){

  // Init namespace, if needed. 
  _s = _s || {};

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
      // Create the root step 
      this.step = $.sowl.step('template'); 
    },

    /**
     * Get the template name. 
     */
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

    getRootStep: function getRootStep() {
      return this.step;
    }, 

  };

  _s.template.fn.init.prototype = _s.template.fn;

  //---------------------------------------------------------------------------
  
  return _s;

})(jQuery, jQuery.sowl);
