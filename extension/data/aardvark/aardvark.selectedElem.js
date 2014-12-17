(function(_a) {

  // IT! hidden in closure so that aardvark don't try to f*ck with us...
  var selectedElem;


  //TODO store and restore dynamically according to the list of props
  //var props = [ 'draggable' ];
  var orig = {
    style: {},
  };

  _a.getSelectedElem = function() {
    return selectedElem;
  }; 

  _a.setSelectedElem = function(elem) {

    // restore original element's state
    if (selectedElem) {
      selectedElem.draggable = orig.draggable;
      selectedElem.style.userSelect = orig.style.userSelect;
    }

    // store new element's state
    // and set it
    if (elem) {
      orig.draggable = elem.draggable;
      orig.style.userSelect = elem.style.userSelect;
      elem.draggable = true;
      elem.style.userSelect = 'none';
    }

    // set
    selectedElem = elem;
  };

})(aardvark);
