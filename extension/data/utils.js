if (!String.prototype.format) {
  /**
   * usage "{0} world!".format("Hello");
   */
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined' ? args[number] : match ;
    });
  };
}; 

if (!String.prototype.endsWith) {
  /**
   * Return true if string ends with suffix. 
   */
  String.prototype.endsWith = function (suffix) {
    return (this.substr(this.length - suffix.length) === suffix);
  }; 
};

if (!String.prototype.startsWith) {
  /**
   * Return true if string starts with prefix. 
   */
  String.prototype.startsWith = function(prefix) {
    return (this.substr(0, prefix.length) === prefix);
  }; 
};

//==================================================================================

var logger = {

  TRACE: true, 

  DEBUG: true, 

  trace: function(msg, args, fnName) {
    if(this.TRACE) {
      if(arguments.length < 2) {
        console.log("sowl - trace - {0}".format(msg));

      } else {
        fnName = fnName || (args.callee == null || args.callee.name == "" ? "__unknown__" : args.callee.name);

        args = args || [];
        args = [].map.call(args, function(elem){
          if (elem === undefined) { return 'undefined'; }
          if (elem instanceof Function) { return "function " + elem.name; }
          if (elem instanceof Object) {
            try {
              return JSON.stringify(elem, null, 2);
            } catch (e) { /* fallback to toString() - on cyclic reference */ }
          }
          return elem.toString();
        });
        var argsStr = (args.length === 0 ? "" : [].join.call(args, ", ")); 
        console.log("sowl - trace - {0}({1}) - {2}".format(fnName, argsStr, msg));
      }
    }
  }, 

  debug: function(msg) {
    if(this.DEBUG) {
      console.log("sowl - debug - {0}".format(msg));
    }
  }, 

  error: function(msg) {
    console.error("sowl - error - {0}".format(msg));
  }, 
}; 

