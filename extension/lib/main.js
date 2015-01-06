var self    = require("sdk/self");
var tabs    = require('sdk/tabs');
var ui      = require("sdk/ui");
var buttons = require('sdk/ui/button/action');
var filepicker = require("./filepicker.js");

const {Cu} = require("chrome");
// To read & write content to file
const {TextDecoder, TextEncoder, OS} = Cu.import("resource://gre/modules/osfile.jsm", {});


var button = buttons.ActionButton({
  id: "mozilla-link",
  label: "Visit Mozilla",
  icon: {
    "16": "./icons/rdf_blue.png",
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
        self.data.url('aardvark/aardvark.selectedElem.js'),
        self.data.url('aardvark/aardvark.commands.js'),
        self.data.url('aardvark/aardvark.main.js'), 
        self.data.url('aardvark/aardvark.sowl.js'), 
        self.data.url('aardvark/aardvark.port.js'), 
      ], 
    });

    var messages = [
      'sowl-selection-start', 
      'sowl-selection-selected', 
      'sowl-selection-clicked', 
    ];

    sidebar_worker.port.on('sowl-selection-context', function(tab_message) {
      console.log('got message [sowl-aardvark-context]: ' + JSON.stringify(tab_message));
      tab_worker.port.emit('sowl-aardvark-context', tab_message);
    });

    //tab_worker.port.on('sowl-aardvark-dragged', function(tab_message) {
    //  console.log('got message [sowl-aardvark-dragged]: ' + JSON.stringify(tab_message));
    //  sidebar_worker.port.emit('sowl-selection-dragged', tab_message);
    //}); 

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

    tab_worker.port.on('sowl-aardvark-dropped', function(tab_message) {
      console.log('got [sowl-aardvark-dropped]: ' + JSON.stringify(tab_message));
      console.log('sending [sowl-selection-dropped]: ' + JSON.stringify(tab_message) + ' to sidebar');
      sidebar_worker.port.emit('sowl-selection-dropped', tab_message);
    });

    // Now start the aardvark
    console.log('sending message [sowl-aardvark-start] to current tab');
    tab_worker.port.emit('sowl-aardvark-start');
  });

  sidebar_worker.port.on('sowl-scenario-save', function(scenario_data) {
    console.log('got [sowl-scenario-save]');
    filepicker.promptForScenario(function(filePath) {
      console.log('filepicker success');
      // For using OS.File I/O operations
      let encoder = new TextEncoder();
      let array = encoder.encode(scenario_data);
      OS.File.writeAtomic(filePath, array, {tmpPath: "file.txt.tmp"});
    });
  });

};

