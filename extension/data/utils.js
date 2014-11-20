// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}; 

String.prototype.endsWith = function (suffix) {
  return (this.substr(this.length - suffix.length) === suffix);
}; 

String.prototype.startsWith = function(prefix) {
  return (this.substr(0, prefix.length) === prefix);
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
        fnName = fnName || (args == null || args.callee == null || args.callee.name == "" ? "__unknown__" : args.callee.name);
        var argsStr = (args == null ? "" : [].join.call(args, ", ")); 
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

