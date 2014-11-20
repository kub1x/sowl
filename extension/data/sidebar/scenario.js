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

  init: function() {
    logger.trace("start", arguments); 

    var treema = $('#sowl-scenario-treema').treema({schema: sowl.scenario.schema, data: sowl.scenario.data});
    treema.build();

  }, 

}; 


// Load
$(function() {
  sowl.scenario.init();
});
