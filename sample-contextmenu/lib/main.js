
// main.js
var tabs = require("sdk/tabs");
var data = require("sdk/self").data;
var { ActionButton } = require("sdk/ui/button/action");

// Menu button
var button = ActionButton({
  id: "start-contextmenu",
  label: "Start Context Menu",

  icon: {
    "16": "./icons/jqueryui-16.png",
  },

  onClick: function(state) {

    var pm = require("sdk/page-mod").PageMod({
      include: tabs.activeTab.url,
      attachTo: ["existing", "top"],
      contentScriptFile: [
        //data.url('jquery/jquery-1.10.2.js'),
        data.url('jquery/jquery-2.1.0.js'),
        data.url('jquery/jquery-ui-position-1.10.0.js'),
        data.url('jquery/jquery.contextmenu-1.6.6.js'),
        data.url('doit.js'),
      ],

      // NOTE contentStyleFile is supported with PageMod only!
      contentStyleFile: [
        data.url('jquery/jquery.contextmenu.css'), 
      ], 

      onAttach: function onAttach(worker) {
        console.log('attached on: ' + worker.tab.title);

        worker.port.on('context-menu-clicked', function(message) {
          console.log('got message [context-menu-clicked]: ' + JSON.stringify(message));
        });
      }
    });

    console.log("button '" + state.label + "' was clicked, attaching jQuery-ui with contextMenu");

  }, 
});

