(function($){

  $.step = function(elem){
    return new $.step.fn.init(elem);
  };

  $.step.fn = $.step.prototype = {

    /**
     *
     */
    init: function init(elem) {
      this.$elem = $(elem);
      // Test already existent...
      var prop = this.$elem.prop('step')
      if (prop) {
        logger.debug('using cached step');
        return prop;
      }
      // or set self as the 'step' property...
      this.$elem.prop('step', this);
      return this;
    }, 

    /**
     *
     */
    generate: function generate() {
      return { };
    }, 

  };
  
  $.step.fn.init.prototype = $.step.fn;

  //---------------------------------------------------------------------------
  //---------------------------------------------------------------------------
  //---------------------------------------------------------------------------
  
  $.step.withSubsteps = function(elem) {
    return new $.step.withSubsteps.fn.init(elem);
  };

  $.step.withSubsteps.fn = $.step.withSubsteps.prototype = $.extend(Object.create($.step), {

    init: function init(elem) {
      $.step.fn.init.call(this, elem);
      this.steps = []; 
      return this;
    }, 

    generate: function generate() {
      return $.extend($.step.fn.generate.call(this), {
        steps: this.steps.map(function(item){ return item.generate() }), 
      });
    }, 

  });

  $.step.withSubsteps.fn.init.prototype = $.step.withSubsteps.fn;

  //---------------------------------------------------------------------------
  //---------------------------------------------------------------------------
  //---------------------------------------------------------------------------

  $.step.ontoElem = function(elem) {
    return new $.step.ontoElem.fn.init(elem);
  };

  $.step.ontoElem.fn = $.step.ontoElem.prototype = $.extend(Object.create($.step.withSubsteps), {

    /**
     *
     */
    init: function init(elem) {
      $.step.withSubsteps.fn.init.call(this, elem);
      this.$elem.addClass('create');

      this.command = 'onto-elem';
      //this.type = '';
      
      return this;
    }, 

    /**
     *
     */
    generate: function() {
      return $.extend($.step.withSubsteps.fn.generate.call(this), {
          command: this.command,
          //type: this.type,
          //selector: this.selector.generate(), 
      });
    }, 

  });

  $.step.ontoElem.fn.init.prototype = $.step.ontoElem.fn;

})(jQuery);

$(function() {
  console.log($.step.ontoElem('<div>').generate());
});

