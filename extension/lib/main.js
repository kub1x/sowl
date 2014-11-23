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
  // Open sidebar to work with
  sidebar.show();
}

var sidebar = ui.Sidebar({
  id: 'sowl-sidebar',
  title: 'sowl', 
  url: self.data.url("sidebar/sidebar.html"), 
  onAttach: onSidebarAttach, 
});

function onSidebarAttach( sidebar_worker ) {
  sidebar_worker.port.on('sowl-selection-start', function(sidebar_message) {
      console.log('got message [sowl-selection-start] from sidebar with data:: ' + JSON.stringify(sidebar_message));

    // Inject aardvark into current page
    var tab_worker = tabs.activeTab.attach({
      contentScriptFile: [
        self.data.url('jquery/jquery-2.1.1.js'),
        self.data.url('aardvark/aardvark.init.js'),
        self.data.url('aardvark/aardvark.strings.js'),
        self.data.url('aardvark/aardvark.utils.js'),
        self.data.url('aardvark/aardvark.dbox.js'),
        self.data.url('aardvark/aardvark.commands.js'),
        self.data.url('aardvark/aardvark.main.js'), 
        self.data.url('aardvark/aardvark.sowl.js'), 
      ], 
    });

    // Hook it back to sidebar
    tab_worker.port.on('sowl-aardvark-selected', function(tab_message) {
      console.log('got message [sowl-aardvark-selected]: ' + JSON.stringify(tab_message));
      console.log('sending message [sowl-selection-selected]: ' + JSON.stringify(tab_message) + ' to sidebar');
      sidebar_worker.port.emit('sowl-selection-selected', tab_message);
    });

    tab_worker.port.on('sowl-aardvark-clicked', function(tab_message) {
      console.log('got message [sowl-aardvark-clicked]: ' + JSON.stringify(tab_message));
      console.log('sending message [sowl-selection-clicked]: ' + JSON.stringify(tab_message) + ' to sidebar');
      sidebar_worker.port.emit('sowl-selection-clicked', tab_message);
    });

    // Now start the aardvark
    console.log('sending message [sowl-aardvark-start] to current tab');
    tab_worker.port.emit('sowl-aardvark-start');
  });
};

