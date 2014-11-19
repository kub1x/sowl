/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Info Cram 6000.
 *
 * The Initial Developer of the Original Code is
 * Jiří Mašek.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * ***** END LICENSE BLOCK ***** */

/* ************************************************************************** *
 * ******************************** AARDVARK ******************************** *
 * ************************************************************************** */

/**
 * Spustí Aardvark.
 */
sowl.aardvark.start = function( ) {
  var currentBrowser  = aardvarkUtils.currentBrowser();
  aardvarkSelector.start(currentBrowser);
}

/**
 * Zpracuje element vybraný pomocí aardvarku, tj. vygeneruje pro něj selektor
 * a přidá jej do stromu.
 *
 * @param elem      vybraný element
 */
sowl.aardvark.onSelect = function(elem) {
  var selector = this.getBestSelector(elem);
  sowl.scenario.tree.createNewStep(this.resource, selector);
  aardvarkSelector.doCommand('quit');
};

sowl.aardvark.getBestSelector = function(elem) {
  var orig = elem;

  var ts_context = sowl.scenario.tree.getSelected();
  var context = ts_context ? ts_context.step.selector : null;

  // results
  var name;
  var selector = "";

  var currDoc = aardvarkUtils.currentDocument();

  //var parents = context == "" ? Sizzle("body", currDoc) : Sizzle(context, currDoc);
  var parents = context ? $(currDoc).find(context).parents().andSelf().get()/* <-- get() all of them*/ : $(currDoc).find('body').get();

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
              if (classes[i] != "sowl-selection") {
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

