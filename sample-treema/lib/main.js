var self    = require("sdk/self");
var tabs    = require('sdk/tabs');
var ui      = require("sdk/ui");
var buttons = require('sdk/ui/button/action');

var button = buttons.ActionButton({
  id: "sample-treema-link",
  label: "Show Treema",
  icon: {
    "32": "./icons/tree-32.png",
  },
  onClick: handleClick, 
});

function handleClick(state) {
  // Open sidebar to work with
  sidebar.show();
}

var sidebar = ui.Sidebar({
  id: 'sample-treema-sidebar',
  title: 'Treema', 
  url: self.data.url("treema.html"), 
});

