(function($){

  var scenarioTemplate = [
    '<div class="container">', 
    '  <div class="header">', 
    '    <div class="topic">', 
    '      Scenario: <span class="name">npu</span>', 
    '    </div>', 
    '    <div class="settings">', 
    // scenarioSettingsTemplate goes here
    '    </div>', 
    '  </div>', 
    '  <div class="editor-container">', 
    '    <div class="templates">', 
    // templatesListTopicTemplate or templatesListEditTemplate goes here
    '    </div>', 
    '    <div class="editor">', 
    '    </div>', 
    '  </div>', 
    '</div>', 
  ].join('\n');

  // this goes under .container.header
  var scenarioSettingsTemplate = [
    '      <form>', 
    '        <div class="setting">', 
    '          <label for="name">name</label>', 
    '          <input name="name" type="text" class="onlyline" placeholder="scenario name" /><br />', 
    '        </div>', 
    '        <div class="setting">', 
    '          <label for="url">web url</label>', 
    '          <input name="url" type="text" class="onlyline" placeholder="initial url" /><br />', 
    '        </div>', 
    '        <div class="setting">', 
    '          <label for="init">init</label>', 
    '          <input name="init" type="text" class="onlyline" placeholder="initial template"', 
    '               value="init" /><br />', 
    '        </div>', 
    '      </form>', 
  ].join('\n');

  // this goes under .container .editor-container .templates INSTEAD OF .template-list
  var templatesListTopicTemplate = [
    '      <div class="topic">', 
    '        Template: <span class="name">init</span>', 
    '      </div>', 
  ].join('\n');

  // this goes under .container .editor-container .templates INSTEAD OF .topic
  var templatesListEditTemplate = [
    '      <select class="template-list">', 
    '        <option value="init">init</option>', 
    '        <option value="detail">detail</option>', 
    '      </select>', 
    '      <button name="new-template">New</button>', 
  ].join('\n');


  function fillWithTemplate(elem, templateHtml) {
    var $elem = $(elem), 
        $template = $(templateHtml);
    $elem.empty().append($template);
    return $elem;
  };

  
  $.fn.scenario = function(options) {
    $this = $(this);

    //TODO this populating just isn't too nice...

    console.log('loading scenario template');
    var $scenario = fillWithTemplate(this, scenarioTemplate);
    //var $scenario = $(scenarioTemplate);
    //$this.empty().append($scenario);

    var $settings = fillWithTemplate($('.settings', $scenario), scenarioSettingsTemplate);
    //var $settings = $(scenarioSettingsTemplate);
    //$scenario.find('.settings').empty().append($settings);

    var $templates = $(templatesListEditTemplate);
    //TODO populate templates from $.scenario.templates.get();
    $scenario.find('.templates').empty().append($templates);


    //TODO XXX !!! create scenario object
    //var $scenario = $.scenario($this);
    $this.prop('scenario', $scenario);
    return $scenario;
  };

})(jQuery);

