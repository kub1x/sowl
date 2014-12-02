logger.trace("scenario.js - start");

sowl.scenario = {
  data : [], 
    
  schema: {
    type: "array", 
    items: {
      additionalProperties: false, 
      displayProperty: "name",
      type: "object", 
      properties: {
        "name": {
          type: "string", 
        }, 
        "cmd": {
          type: "string", 
          enum: ["do-click", "value-of", "onto-elem", ], 
        }, 
        "type-of": {
          type: "string", 
        }, 
        "property": {
          type: "string", 
        }, 
        "selector": {
          type: "string", 
        }, 
      }, 
    }, 
  }, 

  //treema: null, 

  init: function() {
    logger.trace("start", arguments); 

    //sowl.treema = $('#sowl-scenario-treema').treema({schema: sowl.scenario.schema, data: sowl.scenario.data});
    //sowl.treema.build();
  }, 

}; 


var Template = function(name) {
  this.name = name;
  this.steps = [];
};

var 


// Load
$(function() {
  sowl.scenario.init();
});
