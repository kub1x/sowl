// main.js
var tabs = require("sdk/tabs");
var data = require("sdk/self").data;
var { ActionButton } = require("sdk/ui/button/action");

// Menu button
var button = ActionButton({
  id: "start-aardvark",
  label: "Start Aardvark",

  icon: {
    "16": "./icons/aardvark-16.png",
    "32": "./icons/aardvark-32.png"
  },

  onClick: function(state) {
    console.log("button '" + state.label + "' was clicked, attaching aardvark");

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

    worker.port.on('selected', function(message) {
      console.log('got message [selected]: ' + JSON.stringify(message));
    });

    worker.port.emit('start-aardvark');
  }, 
});

