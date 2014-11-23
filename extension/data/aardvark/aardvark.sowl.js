console.log('loaded aardvark: ' + aardvark);

self.port.on('sowl-aardvark-start', function() {
  console.log('trace - got start-aardvark message - starting ardvark');
  aardvark.start();
  $('body').focus();
});

function notifySelect(elem) {
  var msg = getBestSelector(elem);
  console.log('sending [sowl-aardvark-selected]: ' + msg + ' to addon script');
  self.port.emit('sowl-aardvark-selected', msg);
};

function performClick(elem) {
  var msg = getBestSelector(elem);
  console.log('sending [sowl-aardvark-clicked]: ' + msg + ' to addon script');
  self.port.emit('sowl-aardvark-clicked', msg);
  $(elem).click();
};


/**
 * getBestSelector algorithm. 
 * 
 * <ol>
 *   <li>see if element is uniqually selectable within current context. <br />
 *       NOTE after each attempt we try the selector if it is already unique within the whole context or within parent. </li>
 *   <ol>
 *     <li>does it have id/class/name attribute? </li>
 *     <li>is the tag itself unique within parent? </li>
 *     <li>assing nt-child() if we really have to... </li>
 *   </ol>
 *   <li>if not, advance to parent</li>
 *   <li>until we reached parent context<br/>
 *       NOTE we should really be unique when we reach context!</li>
 * </ol>
 *
 * @return string of JSOUP selector
 */

function getBestSelector(elem) {

  /**
   * List of supported methods to obtain node selector. 
   */
  var methods = [

    function byNothing(current, elem) {
      return current;
    }, 

    function byTagName(current, elem) {
      var nodeName = elem.tagName.toLowerCase();
      current.unshift(nodeName);
      return current;
    }, 

    function byId(current, elem) {
      if (elem.id == "") {
        return false;
      }

      if (!isUniqueAttrWithinContext("id", elem.id, elem.ownerDocument)) {
        throw "Ambiguous id: " + elem.id;
      }

      var node = elem.tagName.toLowerCase();
      var result = node + "#" + elem.id;
      current.unshift(result);
      return current;
    }, 

    /**
     * FIXME XXX
     *
     * This method hooks on dynamically added classes (ex: tr.line-s is a class
     * on NPU.cz that specifies currenlty hovered table row), and it creates
     * selector according to this kind of state =/ We have to avoid the dynamic
     * behavior or "pause" it somehow, when aardvark is in place. 
     *
     */
    function byClass(current, elem) {
      if (elem.className == "") {
        return false;
      }

      var node = elem.tagName.toLowerCase();
      var result = node;

      //TODO sort classes by uniqueness, maybe?
      var classes  = elem.className.split(" ");
      for (var i in classes) {
        //TODO fix exclude to the right class!!!
        //TODO selection class name -> resource (instead of hardcoded)
        if (classes[i] != "sowl-aardvark-selection") {
          result += "." + classes[i];
        }
      }

      current.unshift(result);
      return current;
    }, 

    function byNthChild(current, elem) {
      var node = elem.tagName.toLowerCase();

      // Lookup by idx
      var idx = $(elem).parent().children(node).index(elem);
      if (idx == -1) {
        throw "Didn't find even by idx!"; 
      }

      var result = node + ":eq(" + idx + ")";

      current.unshift(result);
      return current;
    }, 

  ]; 


  var currDoc = document;
  //TODO obtain current context from scenario (probly as an argument..?)
  var context = currDoc.body;

  /**
   * Result
   */
  var selector = [];

  var orig = elem;
  var parent = $(elem).parent().get(0); //(elem.parentNode && elem.parentNode.nodeType == elem.ELEMENT_NODE)  ?  elem.parentNode  :  null;

  do {

    var result;

    for (var m in methods) {
      try {
        // Passing COPY of current selector array! 
        result = methods[m](selector.slice(), elem);

        console.log('trying method: ' + methods[m].name + ' with result: ' + result);

        // Method doesn't work, just advance to next one. 
        if (!result) {
          continue;
        }

        // Check if method result is unique and equal to orig in parent. 
        var $found = $(result.join(' '), parent);

        console.log("found: " + $found.length);

        if($found.length == 1 && $found.get(0) == orig) {
          // Good selector, advance to parent. 
          selector = result;
          break;
        } else {
          console.log('failed with following attributes, length: ' + $found.length);
          console.log(' equals orig: ' + $found.get(0) == orig); 
          //console.log(' tag name: ' + $found.get(0).nodeName);
          // Bad selector, try next method.  
          result = false;
          continue;
        }
      } catch (e) {
        console.log('exception: ');
        console.log(e);
        // Method failed, just try next one. 
        continue;
      }
    }

    console.log('==== just done with result: ' + result + ' ====');

    //
    // defensive programming - Just a failure test
    //if (!result) {
    //  //TODO FIXME add this to if(DEBUG) !!!
    //  var msg = "empty selector result! something got wrong!";
    //  console.error(msg);
    //  debugger; // breakpoint - if debugger is on!
    //  throw msg;
    //}

    //
    // already equivavent?
    var $found = $(selector.join(' '), context);
    if ($found.length == 1 && $found.get(0) == orig) {
      return selector.join(' ').trim();
    } else {
      debugger;
      console.log('failed with following attributes, length: ' + $found.length);
      console.log(' equals orig: ' + $found.get(0) == orig); 
      console.log(' tag name: ' + $found.get(0).nodeName);
    }

    //
    // advance to parent
    elem = parent;
    parent = $(elem).parent().get(0); //(elem.parentNode && elem.parentNode.nodeType == elem.ELEMENT_NODE)  ?  elem.parentNode  :  null;

    //
    // check if we reached the context
    // TODO this should be unnecessary - the result should be unique in context
    if ($(context).index(elem) != -1) {
      return selector.join(' ').trim();
    }
    //for (var j = 0; j < context.length; j++) {
    //    if (context[j] == elem) {
    //      return selector.join(' ').trim();
    //    }
    //}

    console.log('==== not quite there yet, next parent: ' + parent.nodeName + ' ====');

  //TODO while true sucks...
  } while (parent != null);

};


/**
 * Ověří, zdali testované ID je v rámci dokumentu unikátní.
 *
 * @param id        prověřované ID
 * @param doc       objekt dokumentu
 * @return          <code>true</code>, je-li unikátní, <code>false</code> není-li
 *
 */
function isUniqueAttrWithinContext(attr, value, context) {
    var selected = $("[" + attr + "=" + value + "]", context);
    return !(selected.length > 1);
}

/**
 * Check if given selector is unique within given context. 
 *
 * @return <code>true</code>, if the selector selects exactly one element
 */
function isUniqueSelector(selector, context) {
    var selected = $(selector, context);

    // Defensive programming - not a usefull selector
    if (selected.length < 1) {
      throw "Selector \"" +selector+ "\" does not select any element!";
    }

    return selected.length == 1;
}




