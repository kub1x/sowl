// File with snippets of js code I erased from sandbox code //

// HOWTO serialize rdfquery database into RDF/XML
// context: sidebar
$().rdf().databank.dump({format:'application/rdf+xml', serialize: true}) 


// HOWTO communicate with addon 'extension script'
// context: sidebar
addon.port.on('ponk', function(message) {
  $('#test').text(message);
});
addon.port.emit('ping');
// main.js
var sidebar = require("sdk/ui/sidebar").Sidebar({
  id: 'my-sidebar',
  title: 'My sidebar',
  url: require("sdk/self").data.url("sidebar.html"),
  onAttach: function (worker) {
    worker.port.on("ping", function() {
      console.log("add-on script got the message");
      worker.port.emit("pong");
    });
  }
});


//HOWTO this fails on same origin policy, we might want to allow xmlns.com and
//other pages in order to allow loading ontologies from the internet...
// context: sidebar, main.js
$.get("http://xmlns.com/foaf/spec/index.rdf", function(data) {
  var sowl.databank = $.rdf().databank.load(data);
  alert("successfully loaded into db: " + sowl.databank);
}).fail(function(err){
  //var txt = 'obj:\n';
  //for ( f in err ) {
  //  txt += f + ': ' + err[f] + ',\n';
  //}
  alert("fail: " + err.getResponseHeader());
});


//HOWTO pass options into content scripts and handle them from there
//context: main.js, content-script
tabs.on('ready', function(tab) {
  tab.attach({
      contentScript: 'window.alert(self.options.message);',
      contentScriptOptions: {"message" : "hello world"}
  });
});
	

//HOWTO communicate between addon <-> content-script
// main.js
var tabs = require("sdk/tabs");
var self = require("sdk/self");
tabs.on("ready", function(tab) {
  worker = tab.attach({
    contentScriptFile: self.data.url("content-script.js")
  });
  worker.port.emit("alert", "Message from the add-on");
});
tabs.open("http://www.mozilla.org");
// content-script.js
self.port.on('alert', function(message) {
  window.alert(message);
});


//HOWTO just printing all props
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


// HOWTO
function getProps() {
  var result = '';
  result += 'properties: \n';
  $.rdf({ databank: sowl.databank })
    .prefix('rdf', 'http://www.w3.org/1999/02/22-rdf-syntax-ns#')
    .prefix('rdfs','http://www.w3.org/2000/01/rdf-schema#') 
    .where('?target a rdf:Property')
    //.where('?target a rdfs:Class')
    .each(function () {
      var tURI = this.target.value;
      result += tURI + ',\n';
    });
};
  

// HOWTO ajax loading content
function loadContent(filePath) {
  console.log('trace - sidebar.html - loading: ' + filePath);

  // METHOD 1 - jQuery.load
  $('#content').load(filePath);

  // METHOD 2 - pure javascript
  var xhr= new XMLHttpRequest();
  xhr.open('GET', filePath, true);
  xhr.onreadystatechange= function() {
    if (this.readyState!==4) return;
    if (this.status!==200) {
      console.log('trace - sidebar.html - error with status: ' + this.status);
      return; // or whatever error handling you want
    }
    document.getElementById('content').innerHTML= this.responseText;
    console.log('trace - sidebar.html - loaded');
  };
  xhr.send();

  // METHOD 3 - async ajax
  $.ajax({
    url: filePath,
    context: document.body, 
    beforeSent: function(data) {
      $('#content').html('Loading...');
    }, 
    success: function(data) {
      $('#content').html(data);
    }, 
    error: function( xhr, textStatus, errorThrown ) {
      var msg = "Sorry but there was an error: " + xhr.status + " " + xhr.statusText;
      $('#content').html( msg );
      console.log(msg)
    }, 
  });
};

