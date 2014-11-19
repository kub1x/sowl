// add the dataTransfer property for use with the native `drop` event
// to capture information about files dropped into the browser window
// see: http://api.jquery.com/category/events/event-object/
// see: http://stackoverflow.com/a/8390260/336753
jQuery.event.props.push( "dataTransfer" );
