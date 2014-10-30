var sowl = {
  rdf: null, 
  databank: null, 
};

$(document).ready(function () {
  $('#test').on('dragover', function(event) {
    //if ($.inArray('application/x-moz-file', event.dataTransfer.types)) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
    //}
  });

  $('#test').on('drop', function(event) {
    //if ($.inArray('application/x-moz-file', event.dataTransfer.types)) {
      event.preventDefault();
      //var type = event.dataTransfer.types[0];
      //var data = event.dataTransfer.getData(type);
      //var file = event.dataTransfer.files[0];
      //event.target.textContent = type + ':' + data + ':' + toPropsString(file);
      var files = event.dataTransfer.files;
      for (var i = 0, file; file = files[i]; i++) {
        console.log('handling file: ' + file + '\n' + event.dataTransfer.types[i] + '\n' + 'JSON: ' + JSON.stringify(file, null, 2));
        loadRdfDocument(file);
      }
    //}
  });
});

function toPropsString(obj) {
  var str = '[';
  for ( p in obj ) {
    //if (obj.hasOwnProperty(p)){
      str += p + ': ' + obj[p] + ';\n'; 
    //}
  }
  str += ']'; 
  return str;
}



function handleFileSelect(evt) {
  // NOTE the name "files" is specified as following:
  // <input type="file" name="files[]" multiple />
  var files = evt.target.files; // FileList object

  var output = [];
  for (var i = 0, f; f = files[i]; i++) {
    output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
                f.size, ' bytes, last modified: ',
                f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                '</li>');
  }
  document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';
}
