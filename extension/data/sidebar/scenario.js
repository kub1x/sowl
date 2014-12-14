logger.trace("scenario.js - start");

//-----------------------------------------------------------------------------

/**
 * Napespace for scenario handling. 
 */
sowl.scenario = {

  init: function() {
    logger.trace("called", arguments);

    var scenario = new Scenario();
    scenario.init = sowl.scenario.init;
    sowl.scenario = scenario;
    logger.debug("sowl.scenario: " + sowl.scenario);
  },



};

//-----------------------------------------------------------------------------

var Scenario = function Scenario(){
  logger.trace("created", arguments);

  this.base = ""; 

  this.templates = { };

}; 

Scenario.prototype.createTemplate = function createTemplate(name) {
  logger.trace("called", arguments);
  var template = new Template(name);
  this.templates[name] = template;
  return template;
};

Scenario.prototype.getTemplate = function getTemplate(name) {
  logger.trace("called", arguments);
  return this.templates[name];
};

Scenario.prototype.removeTemplate = function removeTemplate(name) {
  logger.trace("called", arguments);
  delete this.templates[name];
};

//-----------------------------------------------------------------------------

var Template = function Template(name) {
  logger.trace("created", arguments);
  this.name = name;
  this.steps = [];
};

//-----------------------------------------------------------------------------

var Step = function Step(cmd) {
  logger.trace("created", arguments);
  this.cmd = cmd;
};

Step.prototype.getSubsteps = function getSubsteps() {
  logger.trace("called", arguments);
  if(!this.steps) {
    this.steps = [];
  }
  return this.steps;
};

Step.prototype.prependSubstep = function prependSubstep(step) {
  logger.trace("called", arguments);
  this.getSubsteps().unshift(step);
};

Step.prototype.appendSubstep = function appendSubstep(step) {
  logger.trace("called", arguments);
  this.getSubsteps().add(step);
};

Step.prototype.insertSubstep = function insertSubstep(index, step) {
  logger.trace("called", arguments);
  this.getSubsteps().splice(index, 0, step);
};

