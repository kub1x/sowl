jQuery.sowl = (function($, _s){

  _s = _s || {};

  _s.step = function step(cmd) {
    return new _s.step.fn.init(cmd);
  };

  $.extend(_s, {
    CMD_TEMPLATE: 'template', 
    CMD_CALLTEMPLATE: 'call-template', 
    CMD_ONTOELEM: 'onto-elem', 
    CMD_VALUEOF: 'value-of', 
  }); 

  _s.step.fn = _s.step.prototype = {

    /**
     * Constructor setting the cmd. 
     */
    init: function init(cmd) {
      logger.trace("created", arguments);
      this.cmd = cmd;
    },

  };

  _s.step.fn.init.prototype = _s.step.fn;


  /**
   * NOTE all the executors are called using function.call so 'this' refers to the STEP object!
   */

  function buildSimpleInterfaceFor(property) {
    property = property.toLowerCase();
    var fupper = property.replace(/^[a-z]/g, function(first_letter) {
          return first_letter.toUpperCase();
    });
    var getter = 'get'+fupper, 
        setter = 'set'+fupper; 

    var result = {};
    result[getter] = function() { return this[property]; }; 
    result[setter] = function(value) { this[property] = value; }; 
    return result;
  };

  /**
   * Simply getter/setter interfaces. 
   */
  var withSelector = buildSimpleInterfaceFor('select');
  var withType = buildSimpleInterfaceFor('type');

  /**
   * Interface for substeps array handling. 
   */
  var withSubsteps = {

    getSteps: function getSteps() {
      logger.trace("called", arguments);
      if(!this.steps) {
        this.steps = [];
      }
      return this.steps;
    },
    
    prependStep: function prependStep(step) {
      logger.trace("called", arguments);
      this.getSteps().unshift(step);
    },
    
    appendStep: function appendStep(step) {
      logger.trace("called", arguments);
      this.getSteps().add(step);
    },
    
    insertStep: function insertStep(index, step) {
      logger.trace("called", arguments);
      this.getSteps().splice(index, 0, step);
    },

    insertStepBefore: function insertStepBefore(prev, step) {
      this.insertStep(this.findStep(prev), step);
    }, 

    insertStepAfter: function insertStepAfter(prev, step) {
      this.insertStep(this.findStep(prev) + 1, step);
    }, 

    findStep: function findStep(step) {
      var steps = this.getSteps();
      for ( var i in steps ) {
        if (steps[i] === step) {
          return i;
        }
      }
      return -1;
    }, 

  }; 

  /**
   * Building the executors, now..!
   */
  var executors = {};
  function buildExecutor(cmd) {
    // Init as an empty object
    executors[cmd] = executors[cmd] || {};
    // All the additional arguments are interfaces implemented by the step object. 
    // Well add them one by one. 
    var interfaces = Array.prototype.slice.call(arguments, 1);
    for (var i in interfaces) {
      $.extend(executors[cmd], interfaces[i]);
    }
  };
  buildExecutor(_s.CMD_TEMPLATE, withSubsteps);
  buildExecutor(_s.CMD_ONTOELEM, withSubsteps, withSelector, withType);
  buildExecutor(_s.CMD_VALUEOF,  withSelector);

  /**
   * For each implemented executor function, create function in step.fn that will
   * call the related executor according to current step.type. 
   */
  for (var cmd in executors) {
    for (var fun in executors[cmd]) {
      (function(fun){
        if(!_s.step.fn[fun]) {
          /**
           * NOTE we're extending the <code>_s.step.fn</code>, i.e. the <code>prototype</code> object
           * of <code>step</code>. So 'this' referes to current step object. 
           */
          _s.step.fn[fun] = function() {
            var executor = executors[this.cmd][fun];
            if(!executor) throw "executor {1} not implemented for commmand type {0}".format(this.cmd, fun);
            else return executor.apply(this, arguments);
          };
        }
      })(fun);
    }
  }

  return _s;

})(jQuery, jQuery.sowl);

