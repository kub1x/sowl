(function($){

  var html = {};
  html.scenario = [
    '<div class="container">', 
    '  <div class="header">', 
    '    <div class="topic">', 
    '      Scenario: <span class="name">{name}</span>', 
    '    </div>', 
    '    <div class="settings">', 
    '{scenarioSettings}', 
    '    </div>', 
    '  </div>', 
    '  <div class="editor-container">', 
    '    <div class="templates">', 
    '{templatesListHtml}', 
    '    </div>', 
    '    <div class="editor">', 
    '    </div>', 
    '  </div>', 
    '</div>', 
  ].join('\n');

  // this goes under .container .header .settings
  html.scenarioSettings = [
    '      <form>', 
    '        <div class="setting">', 
    '          <label for="name">name</label>', 
    '          <input name="name" type="text" class="onlyline" placeholder="scenario name" value="{name}"/><br />', 
    '        </div>', 
    '        <div class="setting">', 
    '          <label for="url">web url</label>', 
    '          <input name="url" type="text" class="onlyline" placeholder="initial url" value="{url}"/><br />', 
    '        </div>', 
    '        <div class="setting">', 
    '          <label for="init">init</label>', 
    '          <input name="init" type="text" class="onlyline" placeholder="initial template"', 
    '               value="{init}" /><br />', 
    '        </div>', 
    '      </form>', 
  ].join('\n');

  // this goes under .container .editor-container .templates INSTEAD OF .template-list
  html.templatesListTopic = [
    '      <div class="topic">', 
    '        Template: <span class="name">init</span>', 
    '      </div>', 
  ].join('\n');

  // this goes under .container .editor-container .templates INSTEAD OF .topic
  html.templatesList = [
    '      <select class="template-list">', 
    //'{values}', 
    '      </select>', 
    '      <button name="new-template">New</button>', 
  ].join('\n');

  // This goes into .template-list
  html.templatesListItem = [
    '        <option value="{value}">{value}</option>', 
  ].join('\n');

  html.templateEditor = [
    '      <div class="template" name="{name}">', 
    '      </div>', 
  ].join('\n');

  html.step = [
    '        <div class="step {cmd}" tabindex="0">', 
    '          <h4 class="step-name">{name}</h4>', 
    '          <div class="steps">', 
    '          </div>', 
    '        </div>', 
  ].join('\n');


  function loadHtml(elem, html, data, isAppend = false) {
    if (data) {
      console.log('populating html:\n' + html + '\n\nwith data:\n' + JSON.stringify(data, null, 2));
      html = html.format(data);
    }
    var $elem = $(elem), 
        $html = $(html);

    if (!isAppend) {
      $elem.empty();
    }
    $elem.append($html);
    return $elem;
  };


  function addStep(step, templateName, $steps) {
    //TODO instead of scenario use the "steps" container already
    //var $template = $('.editor .template[name="{0}"]'.format(templateName))
    loadHtml($steps, html.step, step, true);
  };

  function addTemplate(name, template, $scenario) {
    loadHtml($('.template-list', $scenario), html.templatesListItem, {value: name}, true);
    var $tmp = loadHtml($('.editor', $scenario), html.templateEditor, {name: name},  true);
    var step = template.getRootStep();
    var $step = loadHtml($tmp, html.step, {cmd: step.getCmd(), name: name},  true);
    //TODO
    //var steps = template.getSteps();
    //for (var i in steps) {
    //  var step = steps[i];
    //  addStep({name: step.getLabel(), cmd: step.getCmd() }, name, $step);
    //}
  };

  function loadAllTemplates(elem, scenario, $scenario) {
    var templates = scenario.getTemplates();
    for (var name in templates) {
      addTemplate(name, templates[name], $scenario);
    }
  }; 

  function loadScenario(elem, scenario) {
    console.log('loading scenario html');
    var $scenario = loadHtml(elem, html.scenario, { name: scenario.getName() });
    var $settings = loadHtml($('.settings', $scenario), html.scenarioSettings);
    var $templates = loadHtml($('.templates', $scenario), html.templatesList);
    loadAllTemplates(elem, scenario, $scenario);
  };

  function loadTemplate(name) {
  };


  function initScenario($elem) {
    // Create new scenario
    var scenario = $.sowl.scenario();
    loadScenario($elem, scenario);
    $elem.prop('scenario', scenario);
  }

  $.fn.scenario = function(options) {
    initScenario(this);
    return this;
  };

})(jQuery);

