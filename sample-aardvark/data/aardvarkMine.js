console.log('loaded aardvark: ' + aardvark);

self.port.on('start-aardvark', function() {
  console.log('trace - got start-aardvark message - starting ardvark');
  aardvark.start();
});

function notifySelect(elem) {
  var msg = getBestSelector(elem);
  self.port.emit('selected', elem);
};

function getBestSelector(elem) {
  var orig = elem;

  var ts_context = null; //TODO GET CONTEXT selectowl.scenario.tree.getSelected();
  var context = ts_context ? ts_context.step.selector : null;

  // results
  var name;
  var selector = "";

  var currDoc = document; //aardvarkUtils.currentDocument();

  //var parents = context == "" ? Sizzle("body", currDoc) : Sizzle(context, currDoc);
  //var parents = context ? $(currDoc).find(context).parents().andSelf().get()/* <-- get() all of them*/ : $(currDoc).find('body').get();
  var parents = document.body;

  var topReached = false;
  var idFound = false;
  var isFound = false;
  do
  {
      var node = elem.tagName.toLowerCase();

      // přidaní selektoru ID

      if (elem.id != "") {
          if (!name) {
              name = elem.id;
          }

          // ověření, zdali je ID v rámci dokumentu unikátní

          if (isUniqueID(elem.id, elem.ownerDocument)) {
              node += "#" + elem.id;

              idFound = true;
          } else {
              node += "[id=" + elem.id + "]";
          }
      }

      // přidaní selektoru třídy

      if (elem.className != "") {
          var classes  = elem.className.split(" ");

          for (var i in classes) {
              if (classes[i] != "selectowl-selection") {
                  if (!name) {
                      name = classes[i];
                  }
              
                  node += "." + classes[i];
              }
          }
      }

      prev = elem;
      elem = (elem.parentNode && elem.parentNode.nodeType == elem.ELEMENT_NODE)  ?  elem.parentNode  :  null;

      // ověření, zdali rodič elementu zpracovávaného v cyklu není již
      // elementem nadřazeného kontextu

      for (var j = 0; j < parents.length; j++) {
          if (parents[j] == elem) {
              topReached = true;
              break;
          }
      }

      // already equivavent?
      var $found = $(currDoc).find(node + ' ' + selector);
      if ($found.length == 1 && $found.get(0) == orig) {
        isFound = true;
      }

      // index if needed to match properly!
      if (!isFound && !idFound) {
        var idx = $(elem).children(prev.tagName).index(prev);
        if (idx != -1) {
          node += ":eq(" + idx + ")";
        }
        console.log('looking for element: ' + prev.tagName + ' within element: ' + elem.tagName + ' with result idx: ' + idx);
      }

      //
      // just do it!
      selector = node + " " + selector;

      // already equivavent?
      var $found = $(currDoc).find(selector);
      if ($found.length == 1 && $found.get(0) == orig) {
        isFound = true;
      }

  } while (!topReached && !idFound && !isFound && elem != null);

  //We might have added some whitespaces around
  selector = selector.trim();

  return selector;
};

