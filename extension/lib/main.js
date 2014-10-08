var self    = require("sdk/self");
var tabs    = require('sdk/tabs');
var ui      = require("sdk/ui");
var buttons = require('sdk/ui/button/action');

var button = buttons.ActionButton({
  id: "mozilla-link",
  label: "Visit Mozilla",
  icon: {
    "16": "./icon-16.png",
    "32": "./icon-32.png",
    "64": "./icon-64.png"
  },
  onClick: handleClick, 
});

function handleClick(state) {
  // Attach Worker for communication
  tabs.activeTab.attach(worker);

  // Open sidebar to work with
  sidebar.show();
}

var sidebar = ui.Sidebar({
    id: 'sowl-sidebar',
    title: 'sOWL', 
    url: self.data.url("sidebar.html"), 
    onAttach: function(worker) {
      worker.port.on('some-message', function() {
        worker.port.emit('some-response', 'muj text');
      });
    }, 
});


var worker = {
  contentScriptFile: [
    //self.data.url("script1.js"), 
    //self.data.url("script2.js"), 
  ], 
};


