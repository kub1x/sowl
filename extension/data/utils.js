if (!Object.prototype.resolve) {
  /**
   * usage { a: { b: ['neco'] } }.resolve("a.b.0"); // returns 'neco'
   * TODO handle ""s and ''s to allow period (the '.' char) in names. 
   * TODO handle []s to allow internal [] notation like o.resolve('a.b[0]') maybe. 
   */
  Object.prototype.resolve = function(path) {
    var p = path.split('.'), 
        o = this, l = p.length, i;
    try {
      for (i=0; i<l; ++i) {
        o = o[p[i]];
      }; 
      return o;
    } catch (e) {
      return undefined;
    }
  };
};

if (!String.prototype.format) {
  /**
   * NOTE This method determines the "type" of matching according to first parameter
   *      if you do .format(["a"], "b"), only the array in the first attribute will be 
   *      used, the rest will be ignored. 
   *
   * usage "{0} world! {1}".format("Hello", "Howdy?");   // prints "Hello world! Howdy?"
   * usage "{0} world! {1}".format(["Hello", "Howdy?"]); // prints "Hello world! Howdy?" too
   * usage "{first} world! {second}".format({first: "Hello", second: "Howdy?}); // prints the same
   */
  String.prototype.format = function(first) {
    var args = (first instanceof Array ? first :
               (first instanceof Object ? first :
                arguments));
    return this.replace(/{([^\}]+)}/g, function(match, path) { 
      var res = Object.prototype.resolve.call(args, path);
      return typeof res != 'undefined' ? res : match ;
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

