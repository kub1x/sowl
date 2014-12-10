(function($){

  $.scenario = function( elem ){
    $.fn.scenario.init(elem);
  };


  $.scenario.fn = $.scenario.prototype = {

    init: function init( elem ) {
      this.$elem = $(elem);
    }, 
  };


  //---------------------------------------------------------------------------
  
  $.scenario.fn.init.prototype = $.scenario.fn;

}(jQuery);
