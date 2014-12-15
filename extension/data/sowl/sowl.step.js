jQuery.sowl = (function(_s){
  if (!_s) _s = {};

  _s.step = function step(cmd) {
    return new _s.step.fn.init(cmd);
  };

  _s.step.fn = _s.step.prototype = {

    /**
     *
     */
    init: function init(cmd) {
      logger.trace("created", arguments);
      this.cmd = cmd;
    },

  };


  /**
   * NOTE all the executors are called using function.call so this refers to the STEP object!
   */
  var executors = {};
  function buildExecutor(cmd) {
    //TODO XXX
    //TODO XXX
    //TODO XXX
    //TODO XXX
    //TODO arguments without first!!!!!!!!!!
    executors[cmd] = $.extend({}, arguments);
  };

  var withSelector = {

    getSelector: function getSelector() {
      return this.selector;
    }, 

    setSelector: function setSelector(selector) {
      this.selector = selector;
    }, 

  };

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

  }

  //TODO CHECKME
  buildExecutor('template', withSubsteps);
  //executors['template'] = $.extend({}, withSubsteps, {
  //});

  //TODO CHECKME
  //executors['onto-elem'] = $.extend({}, withSubsteps, withSelector, {
  buildExecutor('onto-elem', withSubsteps, withSelector, {

    getType: function getType() {
      return this.type;
    }, 

    setType: function setType(type) {
      this.type = type;
    }, 

  });

  //TODO CHECKME
  //executors['value-of'] = $.extend({}, withSelector, {
  buildExecutor('value-of',  withSelector, {
  });


  // For each implemented executor function, create function in step.fn that will call the related executor according to current step.type. 
  for (var cmd in executors) {
    for (var fun in executors[cmd]) {
      (function(fun){
        if(!_s.step.fn[fun]) {
          /**
           * NOTE we're extending the fn, thus prototype object of step. 
           * this referes to current step object
           */
          _s.step.fn[fun] = function() {
            var executor = executors[this.cmd][fun];
            if(!executor) throw "executor {1} not implemented for commmand type {0}".format(this.cmd, fun);
            else return executor.call(this, arguments);
          };
        }
      })(fun);
    }
  }

  return _s;
})(jQuery.sowl);

