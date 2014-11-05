/** file: ontology.js */
console.log('trace - ontology.js - begin');


/**
 * On document ready
 */
$(document).ready(function () {

  /**
   * Hook drag over to accept dropping. 
   */
  $('#ontology_load_area').on('dragover', onDroppableDragOver);
  $('#ontology_load_area').on('drop', onLoadDrop);
});


/**
 * This handler allows dropping on an element. 
 */
function onDroppableDragOver(event) {
  //if ($.inArray('application/x-moz-file', event.dataTransfer.types)) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
  //}
};


/**
 *
 */
function onLoadDrop(event) {
  //if ($.inArray('application/x-moz-file', event.dataTransfer.types)) {
  event.preventDefault();
  //var type = event.dataTransfer.types[0];
  //var data = event.dataTransfer.getData(type);
  //var file = event.dataTransfer.files[0];
  var files = event.dataTransfer.files;
  for (var i = 0, file; file = files[i]; i++) {
    console.log('handling file: ' + file + '\n' + event.dataTransfer.types[i] + '\n' + 'JSON: ' + JSON.stringify(file, null, 2));
    loadRdfDocument(file);
  }
  //}
}


/**
 *
 */
function loadRdfDocument(file) {
  var reader = new FileReader();

  // Closure to capture the file information.
  reader.onload = (function(theFile) {
    return function(e) {
      // Render thumbnail.
      
      // TODO move to backend
      var xmlDoc = $.parseXML(e.target.result);

      // INIT sowl databank
      if(sowl.databank == undefined || sowl.databank == null) {
        sowl.rdf = $.rdf();
        sowl.databank = sowl.rdf.databank;
      }
      
      sowl.databank.load(xmlDoc);
      
    };
  };

  reader.readAsText(file);
};


