//addon.port.on('some-response', function(message) {
//  $('#test').text(message);
//});
//
//addon.port.emit('some-message');


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
      var type = event.dataTransfer.types[0];
      var data = event.dataTransfer.getData(type);
      var file = event.dataTransfer.files[0];
      event.target.textContent = type + ':' + data + ':' + file;
    //}
  });

  //$.get("http://xmlns.com/foaf/spec/index.rdf", function(data) {
  //  alert("success");
  //  var subjectdb = $.rdf().databank.load(data);

  //  var outsubjectlist = "<ul>";
  //  var targetQuery = $.rdf({ databank: subjectdb })
  //  .prefix('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
  //  .prefix('rdfs','http://www.w3.org/2000/01/rdf-schema#') 
  //  //.prefix('foaf','http://xmlns.com/foaf/0.1/')
  //  .where('?target a rdfs:Class')
  //  .each(function () {
  //    var tURI = this.target.value;
  //    outsubjectlist += "<li>" + tURI + "</li>";
  //  });

  //  outsubjectlist += "</ul>";

  //  console.log(outsubjectlist);

  //  $('#test').html(outsubjectlist);
  //}).fail(function(err){
  //  //var txt = 'obj:\n';
  //  //for ( f in err ) {
  //  //  txt += f + ': ' + err[f] + ',\n';
  //  //}
  //  alert("fail: " + err.getResponseHeader());
  //});
});
