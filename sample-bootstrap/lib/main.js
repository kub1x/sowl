var self    = require("sdk/self");
var tabs    = require('sdk/tabs');
var ui      = require("sdk/ui");
var buttons = require('sdk/ui/button/action');

var button = buttons.ActionButton({
  id: "click-sample-bootstrap",
  label: "Open Sample Bootstrap Sidebar",
  icon: {
    "16": "./icons/bootstrap-16.png",
    "32": "./icons/bootstrap-32.png",
  },
  onClick: handleClick, 
});

function handleClick(state) {
  // Open sidebar to work with
  sidebar.show();
}

var sidebar = ui.Sidebar({
  id: 'sample-bootstrap-sidebar',
  title: 'Get bootstrap?', 
  url: self.data.url("sidebar.html"), 
});

