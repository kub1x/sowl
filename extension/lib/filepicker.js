var {Cc, Ci} = require("chrome");
const nsIFilePicker = Ci.nsIFilePicker;

function promptForScenario( callback ) {
  var fp = Cc["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
  var window = require("sdk/window/utils").getMostRecentBrowserWindow();

  var title = "Select a scenario file";
  fp.init(window, title, nsIFilePicker.modeSave);

  fp.appendFilter("SOWL scenario", "*.sowl");
  fp.appendFilters(nsIFilePicker.filterAll | nsIFilePicker.filterText);

  console.log('openning prompt for scenario filepicker');

  var rv = fp.show();
  if (rv == nsIFilePicker.returnOK || rv == nsIFilePicker.returnReplace) {
    var file = fp.file;
    // Get the path as string. Note that you usually won't
    // need to work with the string paths.
    var path = fp.file.path;
    // work with returned nsILocalFile...
    //
    if(!path.endsWith('.sowl')) {
      path += '.sowl';
    }
    
    // DO IT!
    callback(path);

  }
  return path;
}

function promptForOntology() {
  var fp = Cc["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
  var window = require("sdk/window/utils").getMostRecentBrowserWindow();

  var title = "Select an ontology file";
  fp.init(window, title, nsIFilePicker.modeOpen);

  fp.appendFilter("Ontology files (RDF, OWL, ...)", "*.owl,*.rdf,*.xml");
  fp.appendFilters(nsIFilePicker.filterAll | nsIFilePicker.filterText);

  console.log('openning prompt for ontology filepicker');

  var rv = fp.show();
  if (rv == nsIFilePicker.returnOK || rv == nsIFilePicker.returnReplace) {
    var file = fp.file;
    // Get the path as string. Note that you usually won't
    // need to work with the string paths.
    var path = fp.file.path;
    // work with returned nsILocalFile...
  }
  return path;
}

exports.promptForOntology = promptForOntology;
exports.promptForScenario = promptForScenario;
