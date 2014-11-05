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
 * The Original Code is Aardvark Firefox extension.
 *
 * The Initial Developer of the Original Code is
 * Rob Brown.
 * Portions created by the Initial Developer are Copyright (C) 2006-2007
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 * Wladimir Palant
 * Wind Li
 * Jiří Mašek
 *
 * ***** END LICENSE BLOCK ***** */

/**********************************
 * autopager-selector.js *
 **********************************/

var aardvarkSelector = {
    browser: null,
    paused: false,
    selectedElem: null,
    commentElem : null,
    mouseX: -1,
    mouseY: -1,
    commandLabelTimeout: 0,
    borderElems: null,
    labelElem: null,
    onStartFunctions: [],
    onSelectFunctions: [],
    onQuitFunctions:[]
};

aardvarkSelector.registorStartFunction = function (func)
{
    this.onStartFunctions.push(func);
}
aardvarkSelector.registorSelectFunction = function (func)
{
    this.onSelectFunctions.push(func);
}
aardvarkSelector.registorQuitFunction = function (func)
{
    this.onQuitFunctions.push(func);
}
aardvarkSelector.clearFunctions = function ()
{
    this.onStartFunctions = [];
    this.onSelectFunctions = [];
    this.onQuitFunctions = [];
}

aardvarkSelector.CanSelect = function (browser) {
    if (!browser || !browser.contentWindow ||
        !(browser.contentDocument instanceof HTMLDocument) ||
        !browser.contentDocument.body)
        return false;

    var location = browser.contentWindow.location;
    if (location.href == "about:blank")
        return false;

    if (location.hostname == "" &&
        location.protocol != "mailbox:" &&
        location.protocol != "imap:" &&
        location.protocol != "news:" &&
        location.protocol != "snews:" &&
        location.protocol != "file:")
        return false;

    return true;
}

aardvarkSelector.addEventListener = function(browser,name,func,user)
{
    browser.contentWindow.addEventListener(name, func, user);

    if (browser.contentWindow.frames != null) {
        //alert(doc.defaultView.frames.length);
        for(var i=0;i<browser.contentWindow.frames.length;++i) {
            browser.contentWindow.frames[i].addEventListener(name, func, user);
        }
    }

}
aardvarkSelector.removeEventListener = function(browser,name,func,user)
{
    browser.contentWindow.removeEventListener(name, func, user);

    if (browser.contentWindow.frames != null) {
        //alert(doc.defaultView.frames.length);
        for(var i=0;i<browser.contentWindow.frames.length;++i) {
            browser.contentWindow.frames[i].removeEventListener(name, func, user);
        }
    }

}

aardvarkSelector.start = function(browser) {

    if (!this.CanSelect(browser))
        return;

    //XXX Blink ;)
    //this.blinkElement($(browser.contentDocument).find('body').get(0));

    this.paused = false;
    if (!("viewSourceURL" in this)) {
        // Firefox/Thunderbird and SeaMonkey have different viewPartialSource URLs
        var urls = [
        "chrome://global/content/viewPartialSource.xul",
        "chrome://navigator/content/viewPartialSource.xul"
        ];
        this.viewSourceURL = null;
        for (var i = 0; i < urls.length && !this.viewSourceURL; i++) {
            var request = new XMLHttpRequest();
            request.open("GET", urls[i], false);
            try {
                request.send(null);
                this.viewSourceURL = urls[i];
            } catch (e) {}
        }

        if (!this.viewSourceURL) {
            for (i = 0; i < this.commands.length; i++)
                if (this.commands[i] == "viewSourceWindow")
                    this.commands.splice(i--, 1);
        }
    }

    //console.log('registering events');

    this.addEventListener(browser,"click", this.mouseClick, true);
    this.addEventListener(browser,"mouseover", this.mouseOver, true);
    this.addEventListener(browser,"keypress", this.keyPress, true);
    this.addEventListener(browser,"mousemove", this.mouseMove, true);
    this.addEventListener(browser,"pagehide", this.pageHide, true);
    this.addEventListener(browser,"resize", this.resize, true);

    browser.contentWindow.focus();

    this.browser = browser;

    if (!this.labelElem)
        this.makeElems();

    this.initHelpBox();

    var prefService = Components.classes["@mozilla.org/preferences-service;1"]
    .getService(Components.interfaces.nsIPrefService);
    var branch = prefService.getBranch("autopager.");
    var notshowMenu = false;
    try {
        notshowMenu = branch.getBoolPref("selector.notshowhelp");
    } catch(e) {}

    if (false) //XXX
        this.showMenu();
}

aardvarkSelector.doCommand = function(command, event) {
  //console.log('doCommand(' + command + ')');
    if (this[command](this.selectedElem)) {
        if (event) {
            event.stopPropagation();
        }
    }
    if (event)
        event.preventDefault();
}

aardvarkSelector.initHelpBox = function() {
    for (var i = 0; i < this.onStartFunctions.length; i++)
    {
        this.onStartFunctions[i]();
    }
    var added = false;
    var helpBoxRows = document.getElementById("aardvark-helpbox-rows");
    if (helpBoxRows!=null && helpBoxRows.firstChild)
        added = true;
    ;

    // Help box hasn't been filled yet, need to do it now
    var stringService = Components.classes["@mozilla.org/intl/stringbundle;1"]
    .getService(Components.interfaces.nsIStringBundleService);
    var strings = stringService.createBundle("chrome://selectowl/locale/commands.properties");

    for (var i = 0; i < this.commands.length; i++) {
        var command = this.commands[i];
        var key = strings.GetStringFromName("command." + command + ".key");
        var label = strings.GetStringFromName("command." + command + ".label");
        this.commands[command + "_key"] = key.toLowerCase();
        this.commands[command + "_label"] = label;

        if (!added && helpBoxRows)
        {
            var row = document.createElement("row");
            helpBoxRows.appendChild(row);

            var element = document.createElement("description");
            element.setAttribute("value", key);
            element.className = "key";
            row.appendChild(element);

            element = document.createElement("description");
            element.setAttribute("value", label);
            element.className = "label";
            row.appendChild(element);
        }
    }
}

aardvarkSelector.onMouseClick = function(event) {
    //if (this.paused)
    //        return;
    if (event.button == 2)
        this.doCommand("quit", event);

    if (event.button != 0 || event.shiftKey || event.altKey || event.ctrlKey || event.metaKey)
        return;

    this.doCommand("select", event);
}

aardvarkSelector.onMouseOver = function(event) {
  //XXX workaround windows didn't focus at first
  aardvarkUtils.currentBrowser().contentWindow.focus();

  if (this.paused)
      return;

  var elem = event.originalTarget;
  var aardvarkLabel = elem;
  while (aardvarkLabel && !("aardvarkSelectorLabel" in aardvarkLabel))
      aardvarkLabel = aardvarkLabel.parentNode;

  if (elem == null || aardvarkLabel)
  {
      this.clearBox();
      return;
  }

  if (elem == this.selectedElem)
      return;

  this.showBoxAndLabel(elem, this.makeElementLabelString(elem));
}

aardvarkSelector.onKeyPress = function(event) {
  if (event.altKey || event.ctrlKey || event.metaKey)
      return;

  var command = null;
  if (event.keyCode == event.DOM_VK_ESCAPE)
      command = "quit";
  else if (event.keyCode == event.DOM_VK_RETURN)
      command = "select";
  else if (event.charCode) {
      var key = String.fromCharCode(event.charCode).toLowerCase();
      var commands = this.commands;
      for (var i = 0; i < commands.length; i++)
          if (commands[commands[i] + "_key"] == key)
              command = commands[i];
  }

  if (command)
      this.doCommand(command, event);
}

aardvarkSelector.onPageHide = function(event) {
  this.doCommand("quit", null);
}

aardvarkSelector.onResize = function(event) {
  if (this.selectedElem == null)
      return;

  this.showBoxAndLabel (this.selectedElem, this.makeElementLabelString (this.selectedElem));
}

aardvarkSelector.onMouseMove = function(event) {
  this.mouseX = event.screenX;
  this.mouseY = event.screenY;
}

// Makes sure event handlers like aardvarkSelector.keyPress redirect
// to the real handlers (aardvarkSelector.onKeyPress in this case) with
// correct this pointer.
aardvarkSelector.generateEventHandlers = function(handlers) {
  //console.log('generating event handlers');
    var generator = function(handler) {
        return function(event) {
            aardvarkSelector[handler](event)
        };
    };

    for (var i = 0; i < handlers.length; i++) {
        var handler = "on" + handlers[i][0].toUpperCase() + handlers[i].substr(1);
        this[handlers[i]] = generator(handler);
    }
}
aardvarkSelector.generateEventHandlers(["mouseClick", "mouseOver", "keyPress", "pageHide","resize", "mouseMove"]);

aardvarkSelector.appendDescription = function(node, value, className) {
    var descr = document.createElement("description");
    descr.setAttribute("value", value);
    if (className)
        descr.setAttribute("class", className);
    node.appendChild(descr);
}

/***************************
 * Highlight frame display *
 ***************************/

//-------------------------------------------------
// create the box and tag etc (done once and saved)
aardvarkSelector.makeElems = function ()
{
    this.borderElems = [];
    var d, i;

    for (i=0; i<4; i++)
    {
        d = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
        d.style.display = "none";
        d.style.position = "absolute";
        d.style.height = "0px";
        d.style.width = "0px";
        d.style.zIndex = "65534";
        if (i < 2)
            d.style.borderTop = "5px solid orange";
        else
            d.style.borderLeft = "5px solid orange";
        d.aardvarkSelectorLabel = true; // mark as ours
        this.borderElems[i] = d;
    }

    d = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
    this.setElementStyleDefault (d, "#fdd017");
    d.style.borderTopWidth = "0";
    //d.style.MozBorderRadiusBottomleft = "6px";
    //d.style.MozBorderRadiusBottomright = "6px";
    d.style.zIndex = "65535";
    d.aardvarkSelectorLabel = true; // mark as ours
    this.labelElem = d;
}

aardvarkSelector.makeElementLabelString = function(elem) {
    var s = "<strong style='color:#fff'>" + elem.tagName.toLowerCase() + "</strong>";
    if (elem.id != '')
        s += ", id: " + elem.id;
    if (elem.className != '')
        s += ", class: " + elem.className;
    /*for (var i in elem.style)
		if (elem.style[i] != '')
			s += "<br> " + i + ": " + elem.style[i]; */
    if (elem.style.cssText != '')
        s += ", style: " + elem.style.cssText;

    return s;
}

aardvarkSelector.showBoxAndLabel = function(elem, string) {
    if (jQuery(elem).hasClass("selectowlbox"))
        return;

    var doc = elem.ownerDocument;
    if (!doc || !doc.body)
        return;

    this.selectedElem = elem;

    for (var i = 0; i < 4; i++) {
        try {
            doc.adoptNode(this.borderElems[i]);
        }
        catch (e) {
        // Gecko 1.8 doesn't implement adoptNode, ignore
        }
        doc.body.appendChild(this.borderElems[i]);
    }

    var pos = this.getPos(elem)
    var dims = this.getWindowDimensions (doc);

    this.borderElems[0].style.left
    = this.borderElems[1].style.left
    = this.borderElems[2].style.left
    = (pos.x - 4) + "px";
    this.borderElems[3].style.left = (pos.x + elem.offsetWidth - 1) + "px";

    this.borderElems[0].style.width
    = this.borderElems[1].style.width
    = (elem.offsetWidth + 8) + "px";

    this.borderElems[2].style.height
    = this.borderElems[3].style.height
    = (elem.offsetHeight + 8) + "px";

    this.borderElems[0].style.top
    = this.borderElems[2].style.top
    = this.borderElems[3].style.top
    = (pos.y - 4) + "px";
    this.borderElems[1].style.top = (pos.y + elem.offsetHeight - 1) + "px";

    this.borderElems[0].style.display
    = this.borderElems[1].style.display
    = this.borderElems[2].style.display
    = this.borderElems[3].style.display
    = "";

    var y = pos.y + elem.offsetHeight + 4;

    try {
        doc.adoptNode(this.labelElem);
    }
    catch(e) {
    // Gecko 1.8 doesn't implement adoptNode, ignore
    }
    doc.body.appendChild(this.labelElem);

    this.labelElem.innerHTML = string;
    this.labelElem.style.display = "";

    // adjust the label as necessary to make sure it is within screen and
    // the border is pretty
    if ((y + this.labelElem.offsetHeight) >= dims.scrollY + dims.height)
    {
        this.labelElem.style.borderTopWidth = "5px";
        this.labelDrawnHigh = true;
        y = (dims.scrollY + dims.height) - this.labelElem.offsetHeight;
    }
    else if (this.labelElem.offsetWidth > elem.offsetWidth)
    {
        this.labelElem.style.borderTopWidth = "1px";
        this.labelDrawnHigh = true;
    }
    else if (this.labelDrawnHigh)
    {
        this.labelElem.style.borderTopWidth = "0";
        delete (this.labelDrawnHigh);
    }
    this.labelElem.style.left = (pos.x - 4) + "px";
    this.labelElem.style.top = y + "px";
}

aardvarkSelector.clearBox = function() {
    this.selectedElem = null;

    for (var i = 0; i < this.borderElems.length; i++)
        if (this.borderElems[i].parentNode)
            this.borderElems[i].parentNode.removeChild(this.borderElems[i]);

    if (this.labelElem.parentNode)
        this.labelElem.parentNode.removeChild(this.labelElem);
}

aardvarkSelector.getPos = function (elem)
{
    var pos = {
        x: 0,
        y: 0
    };

    while (elem)
    {
        pos.x += elem.offsetLeft;
        pos.y += elem.offsetTop;
        elem = elem.offsetParent;
    }
    return pos;
}

aardvarkSelector.getWindowDimensions = function (doc)
{
    var out = {};

    out.scrollX = doc.body.scrollLeft + doc.documentElement.scrollLeft;
    out.scrollY = doc.body.scrollTop + doc.documentElement.scrollTop;

    if (doc.compatMode == "BackCompat")
    {
        out.width = doc.body.clientWidth;
        out.height = doc.body.clientHeight;
    }
    else
    {
        out.width = doc.documentElement.clientWidth;
        out.height = doc.documentElement.clientHeight;
    }
    return out;
}

aardvarkSelector.setElementStyleDefault = function (elem, bgColor)
{
    var s = elem.style;
    s.display = "none";
    s.backgroundColor = bgColor;
    //s.borderColor = "black";
    //s.borderWidth = "0px 0px 0px 0px";
    //s.borderStyle = "solid";
    s.fontFamily = "sans-serif";
    s.textAlign = "left";
    s.color = "#fff";
    s.fontSize = "10px";
    s.position = "absolute";
    s.paddingTop = "2px";
    s.paddingBottom = "2px";
    s.paddingLeft = "5px";
    s.paddingRight = "5px";
}

/*********************************
 * Code from aardvarkCommands.js *
 *********************************/

//------------------------------------------------------------
// 0: name, 1: needs element
aardvarkSelector.commands = [
    "select",
    "pause",
    "wider",
    "narrower",
    "quit",
    "blinkElement",
    //,"viewSource",
    //"viewSourceWindow",
    "showMenu"
    ];

//------------------------------------------------------------
aardvarkSelector.wider = function (elem)
{
  //console.log('called wider: ' + elem);
    if (elem)
    {
        var newElem = elem.parentNode;
        if (newElem && newElem.nodeType == newElem.DOCUMENT_NODE && newElem.defaultView && !(newElem.defaultView.frameElement instanceof HTMLFrameElement))
            newElem = newElem.defaultView.frameElement;

        if (!newElem || newElem.nodeType != newElem.ELEMENT_NODE)
            return false;

        if (this.widerStack && this.widerStack.length>0 &&
            this.widerStack[this.widerStack.length-1] == elem)
            {
            this.widerStack.push (newElem);
        }
        else
        {
            this.widerStack = [elem, newElem];
        }
        this.showBoxAndLabel (newElem,
            this.makeElementLabelString (newElem));
        return true;
    }
    return false;
}

//------------------------------------------------------------
aardvarkSelector.narrower = function (elem)
{
    if (elem)
    {
        if (this.widerStack && this.widerStack.length>1 &&
            this.widerStack[this.widerStack.length-1] == elem)
            {
            this.widerStack.pop();
            var newElem = this.widerStack[this.widerStack.length-1];
            this.showBoxAndLabel (newElem,
                this.makeElementLabelString (newElem));
            return true;
        }
    }
    return false;
}

//------------------------------------------------------------
aardvarkSelector.quit = function ()
{
    if (!this.browser)
        return false;

    for (var i = 0; i < this.onQuitFunctions.length; i++)
    {
        this.onQuitFunctions[i]();
    }
    this.clearBox();
    //ehhHideTooltips();

    this.removeEventListener(this.browser,"click", this.mouseClick, true);
    this.removeEventListener(this.browser,"mouseover", this.mouseOver, true);
    this.removeEventListener(this.browser,"keypress", this.keyPress, true);
    this.removeEventListener(this.browser,"mousemove", this.mouseMove, true);
    this.removeEventListener(this.browser,"pagehide", this.pageHide, true);
    this.removeEventListener(this.browser,"resize", this.resize, true);

    this.selectedElem = null;
    this.browser = null;
    this.commentElem = null;
    delete this.widerStack;
    return true;
}

//------------------------------------------------------------
aardvarkSelector.select = function (elem) {
  console.log('trace - aardvark - select()');
  sowl.aardvark.onSelect(elem);
  return true;
}

//------------------------------------------------------------
aardvarkSelector.blinkElement = function (elem)
{
    if (!elem)
        return false;

    if ("blinkInterval" in this)
        this.stopBlinking();

    var counter = 0;
    this.blinkElem = elem;
    this.blinkOrigValue = elem.style.visibility;
    this.blinkInterval = setInterval(function() {
        counter++;
        elem.style.visibility = (counter % 2 == 0 ? "visible" : "hidden");
        if (counter == 6)
            aardvarkSelector.stopBlinking();
    }, 250);

    return true;
}
//------------------------------------------------------------
aardvarkSelector.pause = function (elem)
{
    this.paused = !this.paused;
    return true;
}
aardvarkSelector.stopBlinking = function() {
    clearInterval(this.blinkInterval);
    this.blinkElem.style.visibility = this.blinkOrigValue;

    delete this.blinkElem;
    delete this.blinkOrigValue;
    delete this.blinkInterval;
}

//------------------------------------------------------------
aardvarkSelector.viewSource = function (elem)
{
    if (!elem)
        return false;

    var sourceBox = document.getElementById("autopager-viewsource");
    if (sourceBox.getAttribute("_moz-menuactive") == "true" && this.commentElem == elem) {
        sourceBox.hidePopup();
        return true;
    }
    sourceBox.hidePopup();

    while (sourceBox.firstChild)
        sourceBox.removeChild(sourceBox.firstChild);
    this.getOuterHtmlFormatted(elem, sourceBox);
    this.commentElem = elem;

    var x = this.mouseX;
    var y = this.mouseY;
    setTimeout(function() {
        sourceBox.showPopup(document.documentElement, x, y, "tooltip", "topleft", "topleft");
    }, 500);
    return true;
}

//--------------------------------------------------------
aardvarkSelector.viewSourceWindow = function(elem) {
    if (!elem || !this.viewSourceURL)
        return false;

    var range = elem.ownerDocument.createRange();
    range.selectNodeContents(elem);
    var selection = {
        rangeCount: 1,
        getRangeAt: function() {
            return range
        }
    };

    // SeaMonkey uses a different
    window.openDialog(this.viewSourceURL, "_blank", "scrollbars,resizable,chrome,dialog=no",
        null, null, selection, "selection");
    return true;
}

//--------------------------------------------------------
aardvarkSelector.getOuterHtmlFormatted = function (node, container)
{
    var type = null;
    switch (node.nodeType) {
        case node.ELEMENT_NODE:
            var box = document.createElement("vbox");
            box.className = "elementBox";

            var startTag = document.createElement("hbox");
            startTag.className = "elementStartTag";
            if (!node.firstChild)
                startTag.className += "elementEndTag";

            this.appendDescription(startTag, "<", null);
            this.appendDescription(startTag, node.tagName, "tagName");

            for (var i = 0; i < node.attributes.length; i++) {
                var attr = node.attributes[i];
                this.appendDescription(startTag, attr.name, "attrName");
                if (attr.value != "") {
                    this.appendDescription(startTag, "=", null);
                    this.appendDescription(startTag, '"' + attr.value.replace(/"/, "&quot;") + '"', "attrValue");
                }
            }

            this.appendDescription(startTag, node.firstChild ? ">" : " />", null);
            box.appendChild(startTag);

            if (node.firstChild) {
                for (var child = node.firstChild; child; child = child.nextSibling)
                    this.getOuterHtmlFormatted(child, box);

                var endTag = document.createElement("hbox");
                endTag.className = "elementEndTag";
                this.appendDescription(endTag, "<", null);
                this.appendDescription(endTag, "/" + node.tagName, "tagName");
                this.appendDescription(endTag, ">", null);
                box.appendChild(endTag);
            }
            container.appendChild(box);
            return;

        case node.TEXT_NODE:
            type = "text";
            break;
        case node.CDATA_SECTION_NODE:
            type = "cdata";
            break;
        case node.COMMENT_NODE:
            type = "comment";
            break;
        default:
            return;
    }

    var text = node.nodeValue.replace(/\r/g, '').replace(/^\s+/, '').replace(/\s+$/, '');
    if (text == "")
        return;

    if (type != "cdata") {
        text = text.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }
    text = text.replace(/\t/g, "  ");
    if (type == "cdata")
        text = "<![CDATA[" + text + "]]>";
    else if (type == "comment")
        text = "<!--" + text + "-->";

    var lines = text.split("\n");
    for (var i = 0; i < lines.length; i++)
        this.appendDescription(container, lines[i].replace(/^\s+/, '').replace(/\s+$/, ''), type);
}

//-------------------------------------------------
aardvarkSelector.showMenu = function ()
{
  var helpBox = document.getElementById("aardvark-helpbox");
  
  if (helpBox.getAttribute("_moz-menuactive") == "true") {
      helpBox.hidePopup();
      return true;
  }

  // Show help box
  helpBox.showPopup(this.browser, -1, -1, "tooltip", "topleft", "topleft");
  return true;
}

const aardvarkUtils = {
    log: (location.protocol=="chrome:") ? function(message) {
        if (aardvarkPref.loadBoolPref("debug"))
        {
            var consoleService = Components.classes['@mozilla.org/consoleservice;1']
            .getService(Components.interfaces.nsIConsoleService);
            consoleService.logStringMessage(message)
        }
    } : function(message) {
        if (aardvarkPref.loadBoolPref("debug"))
            debug(message)
    },
    consoleLog: function(message) {
        var consoleService = Components.classes['@mozilla.org/consoleservice;1']
        .getService(Components.interfaces.nsIConsoleService);
        consoleService.logStringMessage(message)
    },
    consoleError: function(message) {
        Components.utils.reportError(message)
    },
    currentDocument: function()
    {
        return this.currentBrowser().contentDocument;
    },
    currentBrowser: function()
    {
        var windowManager = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator);
        var browser = windowManager.getMostRecentWindow("navigator:browser").document.getElementById("content");

        return browser;
    },
    currentWindow: function()
    {
        var windowManager = Components.classes['@mozilla.org/appshell/window-mediator;1'].getService(Components.interfaces.nsIWindowMediator);
        var browserWindow = windowManager.getMostRecentWindow("navigator:browser");
        return browserWindow;
    },
    cloneBrowser: function(targetB, originalB)
    {
        var webNav = targetB.webNavigation;
        var newHistory = webNav.sessionHistory;

        if (newHistory == null)
        {
            newHistory = Components.classes["@mozilla.org/browser/shistory-internal;1"].getService(Components.interfaces.nsISHistory);
            webNav.sessionHistory = newHistory;
        }
        newHistory = newHistory.QueryInterface(Components.interfaces.nsISHistoryInternal);

        // delete history entries if they are present

        if (newHistory.count > 0)
            newHistory.PurgeHistory(newHistory.count);
        var originalHistory  = originalB.webNavigation.sessionHistory;
        originalHistory = originalHistory.QueryInterface(Components.interfaces.nsISHistoryInternal);


        var entry = originalHistory.getEntryAtIndex(originalHistory.index,false).QueryInterface(Components.interfaces.nsISHEntry);
        var newEntry = this.cloneHistoryEntry(entry);
        if (newEntry)
            newHistory.addEntry(newEntry, true);


        webNav.gotoIndex(0);

    },
    cloneHistoryEntry: function(aEntry) {
        if (!aEntry)
            return null;
        aEntry = aEntry.QueryInterface(Components.interfaces.nsISHContainer);
        var newEntry = aEntry.clone(true);
        newEntry = newEntry.QueryInterface(Components.interfaces.nsISHContainer);
        newEntry.loadType = Math.floor(aEntry.loadType);
        if (aEntry.childCount) {
            for (var j = 0; j < aEntry.childCount; j++) {
                var childEntry = this.cloneHistoryEntry(aEntry.GetChildAt(j));
                if (childEntry)
                    newEntry.AddChild(childEntry, j);
            }
        }
        return newEntry;
    }
    ,
    findContentWindow: function(doc) {
        var ctx = doc;
        if(!ctx)
            return null;
        const ci = Components.interfaces;
        const lm = this.lookupMethod;
        if(!(ctx instanceof ci.nsIDOMWindow)) {
            if(ctx instanceof ci.nsIDOMDocument) {
                ctx = lm(ctx, "defaultView")();
            } else if(ctx instanceof ci.nsIDOMNode) {
                ctx = lm(lm(ctx, "ownerDocument")(), "defaultView")();
            } else return null;
        }
        if(!ctx) return null;
        ctx = lm(ctx, "top")();

        return ctx;
    },
    windowEnumerator : function(aWindowtype) {
        if (typeof(aWindowtype) == "undefined")
            aWindowtype = "navigator:browser";
        var WindowManager = Components.classes['@mozilla.org/appshell/window-mediator;1']
        .getService(Components.interfaces.nsIWindowMediator);
        return WindowManager.getEnumerator(aWindowtype);
    },
    numberOfWindows : function(all, aWindowtype) {
        var enumerator = aardvarkUtils.windowEnumerator(aWindowtype);
        var count = 0;
        while ( enumerator.hasMoreElements() ) {
            var win = enumerator.getNext();
            if ("SessionManager" in win && win.SessionManager.windowClosed)
                continue;
            count++;
            if (!all && count == 2)
                break;
        }
        return count;
    },
    isLastWindow : function(aWindowtype) {
        var count = aardvarkUtils.numberOfWindows(false,aWindowtype);
        return count <=1;
    },
    clone : function(obj){
        if(obj == null || typeof obj != 'object')
            return obj;
        var temp = new obj.constructor();

        for(var key in obj)
        {
            temp[key] = this.clone(obj[key]);
        }
        return temp;
    },
    getLocale : function ()
    {
        return navigator.language;
    },
    isChineseLocale : function ()
    {
        var l = navigator.language;
        return (l == 'zh-CN' || l == 'zh-TW');
    },
    parseUri : function (sourceUri){
        var uriPartNames = ["href","protocol","host","hostname","port","pathname","directoryPath","fileName","search","hash"];
        var uriParts = new RegExp("^(?:([^:/?#.]+):)?(?://)?(([^:/?#]*)(?::(\\d*))?)?((/(?:[^?#](?![^?#/]*\\.[^?#/.]+(?:[\\?#]|$)))*/?)?([^?#/]*))?(?:\\?([^#]*))?(?:#(.*))?").exec(sourceUri);
        var uri = {};

        for(var i = 0; i < 10; i++){
            uri[uriPartNames[i]] = (uriParts[i] ? uriParts[i] : "");
        }

        // Always end directoryPath with a trailing backslash if a path was present in the source URI
        // Note that a trailing backslash is NOT automatically inserted within or appended to the "path" key
        if(uri.directoryPath.length > 0){
            uri.directoryPath = uri.directoryPath.replace(/\/?$/, "/");
        }
        uri.pathes = uri.pathname.substring(1).split("/");
        var search = uri["search"];
        var searchParts = this.parseSearch(search);
        uri["searchParts"] = searchParts
        return uri;
    },
    parseSearch : function(search)
    {
        /* parse the query */
        var x = search.replace(/;/g, '&').split('&');
        var q={};
        for (var i=0; i<x.length; i++)
        {
            if (x[i].length==0)
                continue;
            var t = x[i].split('=', 2);
            var name = unescape(t[0]);
            var v;
            if (t.length > 1)
                v = unescape(t[1]);
            else
                v = true;

            if (q[name])
            {
                var vs = [];
                vs[0] = q[name];
                q[name] = vs;
                q[name][q[name].length] = v;
            }
            else
                q[name] = v;
        }
        return q;
    },
    // Dump the object in a table
    dumpResults : function(obj,container){
        var output = "";
        for (var property in obj){
            output += '<tr><td class="name">' + property +
            '</td><td class="result">"<span class="value">' +
            this.dumpObject(obj[property],10) + '</span>"</td></tr>';
        }
        container.innerHTML = "<table>" + output + "</table>";
    },
    dumpObject : function (obj,level)
    {
        if(obj == null || typeof obj != 'object' || level<0)
            return obj;
        var temp = "[";

        for(var key in obj)
        {
            if (temp.length>1)
                temp+=",";
            try{
                temp += key + "=" + this.dumpObject(obj[key],level-1);
            }catch(e){
                temp += key + "=<unable to access>";
            }
        }
        return temp+"]";
    },
    getPattern : function (location ,depth)
    {
        var url=location.protocol + "://" + location.host + (location.port!=""?location.port : "");
        var last;
        for(var lastPos=0;lastPos<depth && lastPos<location.pathes.length;lastPos++)
        {
            url += "/" + location.pathes[lastPos]
        }
        return url + (depth<=location.pathes.length-1 || depth==0 ?"/*":"*");
    },
    isNotMain : function(str,num)
    {
        return ((str.match(/[0123456789-_]/g) && str.match(/[0123456789-_]/g).length>=num)
            || str.replace(/[0123456789-_]/g,'').length==0);
    },
    getMainDirDepth : function (location ,num)
    {
        var align=0;
        if (location.pathname.match(/(\.)(html|shtml|txt|htm)(\*)?$/) || (location.pathname.match(/(\.)(asp|php|php3|php5)(\*)?$/)) && location.search=="")
            align = 1;
        var lastPos =0;
        for(lastPos=location.pathes.length-1-align;
            lastPos>=0 && this.isNotMain(location.pathes[lastPos],num) ;lastPos--)
            {
        }

        //        if (lastPos ==0 && align==0 && location.pathes.length==1 &&
        //                (location.pathes[lastPos].match(/[0123456789-_]/g) == null || location.pathes[lastPos].match(/[0123456789-_]/g).length<num))
        //                return 1;
        return lastPos+1;
    }
}
