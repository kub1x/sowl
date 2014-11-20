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
  onAttach: onSidebarAttach, 
});


var worker = {
  contentScriptFile: [
    self.data.url("jquery.js"), 
    //TODO add aardvar here and see if it works ;)
    //self.data.url("aardvark.js"), 
    //self.data.url("aardvark.sowl.js"), 
    self.data.url("content-script.js"), 
  ], 
};


function onSidebarAttach( worker ) {
  //TODO how to start selection? ;)
  //worker.port.on('start-selection', function(data) {
    //TODO we should hold this worker with page it serves until the selection is stopped again. 
  //});
};


// start aardvark


function incectAardvark() {

  var worker = tabs.activeTab.attach({
    contentScriptFile: [
      data.url('jquery/jquery-2.1.0.js'),
      data.url('aardvark/aardvark.init.js'),
      data.url('aardvark/aardvark.strings.js'),
      data.url('aardvark/aardvark.utils.js'),
      data.url('aardvark/aardvark.dbox.js'),
      data.url('aardvark/aardvark.commands.js'),
      data.url('aardvark/aardvark.main.js'), 
      data.url('aardvark/aardvark.sowl.js'), 
    ], 
  });

  worker.port.on('sowl-aardvark-selected', function(message) {
    console.log('got message [selected]: ' + JSON.stringify(message));
  });

  worker.port.emit('sowl-aardvark-start');
};

