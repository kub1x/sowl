var self    = require("sdk/self");
var tabs    = require('sdk/tabs');
var ui      = require("sdk/ui");
var buttons = require('sdk/ui/button/action');

var button = buttons.ActionButton({
  id: "mozilla-link",
  label: "Visit Mozilla",
  icon: {
    "16": "./icons/icon-16.png",
    "32": "./icons/icon-32.png",
    "64": "./icons/icon-64.png"
  },
  onClick: handleClick, 
});

require('sdk/page-mod').PageMod({
  include: ["*"],
  contentScriptFile: worker, 
  attachTo: ["existing", "top"], 
  onAttach: function onAttach(worker) {
    console.log(worker.tab.title);
  }
});

function handleClick(state) {
  // Attach Worker for communication
  tabs.activeTab.attach(worker);

  // Open sidebar to work with
  sidebar.show();
}

var sidebar = ui.Sidebar({
  id: 'sowl-sidebar',
  title: 'sowl', 
  url: self.data.url("sidebar/sidebar.html"), 
  onAttach: function(worker) {
    worker.port.on('some-message', function() {
      worker.port.emit('some-response', 'muj text');
    });
  }, 
});


var worker = {
  contentScriptFile: [
    self.data.url("jquery.js"), 
    self.data.url("content-script.js"), 
  ], 
};


