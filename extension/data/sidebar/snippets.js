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

