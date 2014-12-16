/**
 * @fileOverview Base jQuery module for sowl
 * @author <a href="mailto:j.podlaha@gmail.com">Jakub kub1x Podlaha</a>
 * @copyright (c) 2014, Jakub kub1x Podlaha
 * @license MIT license (MIT-LICENSE.txt)
 * @version 1.0
 * @requires jquery.js
 */
jQuery.sowl = (function($, _s) {

  _s = _s || {};

  $.extend(_s, {
  });

  //TODO Create API for hooking events
  // .bind(event_name, handler) {
  //  var registered = this.getHandlers(event_name);
  //  if($.inArray(handler, registered) != -1) {
  //    return; 
  //  }
  //  registered.push(handler);
  // }
  // .trigger(event_name, data) {
  //  var registered = this.getHandlers(event_name);
  //  for( var i in registered ) {
  //    setTimeout(0, registered[i](data));
  //  }
  // }
  //NOTE consider using standard DOM event on sidebar and webpage
  // see http://www.sitepoint.com/javascript-custom-events/


})(jQuery, jQuery.sowl);

