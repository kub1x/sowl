
//HOWTO page-mod
require('sdk/page-mod').PageMod({
  include: ["*"],
  contentScriptFile: worker, 
  attachTo: ["existing", "top"], 
  onAttach: function onAttach(worker) {
    console.log(worker.tab.title);
  }
});
