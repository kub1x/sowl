(function($){

  var html = {};
  html.scenario = [
    '<div class="container">', 
    '  <div class="header">', 
    '    <div class="topic">', 
    '      Scenario: <span class="name">unnamed</span>', 
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
    '          <input name="name" type="text" class="onlyline" placeholder="scenario name" value="unnamed"/><br />', 
    '        </div>', 
    '        <div class="setting">', 
    '          <label for="url">web url</label>', 
    '          <input name="url" type="text" class="onlyline" placeholder="initial url" value="{url}"/><br />', 
    '        </div>', 
    '        <div class="setting">', 
    '          <label for="init">init</label>', 
    '          <input name="init" type="text" class="onlyline" placeholder="initial template"', 
    '               value="init" /><br />', 
    '        </div>', 
    '        <div class="setting">', 
    '          <label for="base">init</label>', 
    '          <input name="base" type="text" class="onlyline" placeholder="ontology base URI"', 
    '               value="http://kub1x.org/dip/" /><br />', 
    '        </div>', 
    '      </form>', 
  ].join('\n');

  html.templatesList = [
    '      <button name="new-template">New Template</button>', 
    '      <button name="start-selection">Start selection</button>', 
  ].join('\n');

  html.step = [
    '        <div class="step" data-sowl-cmd="" tabindex="0">', 
    '          <h4 class="step-name">unnamed</h4>', 
    '          <code class="selector"></code>', 
    '          <div class="step-params">', 
    '            <div class="param cmd">', 
    '              <label for="cmd">cmd:</label>', 
    '              <select name="cmd">', 
    '                <option value="onto-elem">create</option>', 
    '                <option value="value-of">assign</option>', 
    '                <option value="call-template">call template</option>', 
    '                <option value="narrow">narrow</option>', 
    '              </select>', 
    '            </div><br />', 
    '            <div class="param name">     <label for="name">     name:</label>     <input type="text" name="name" value="unnamed" /></div><br />', 
    '            <div class="param typeof">   <label for="typeof">   type:</label>     <input type="text" name="typeof"   /></div><br />', 
    '            <div class="param selector"> <label for="selector"> selector:</label> <input type="text" name="selector" /></div><br />', 
    '            <div class="param rel"> <label for="rel"> rel:</label> <input type="text" name="rel" /></div><br />', 
    '            <div class="param property"> <label for="property"> property:</label> <input type="text" name="property" /></div><br />', 
    '            <div class="param url"> <label for="url"> url:</label> <input type="text" name="url" /></div><br />', 
    '          </div>', 
    '          <div class="steps">', 
    '          </div>', 
    '        </div>', 
  ].join('\n');

  function loadHtml(elem, html, data, isAppend = false) {
    if (data) {
      html = html.format(data);
    }
    var $elem = $(elem), 
        $html = $(html);

    if (!isAppend) {
      $elem.empty();
    }
    $elem.append($html);
    return $html;
  };

  function addStepBefore(step) {
    var $step = $(step);
    if ($step.data('sowl-cmd') === 'template') {
      return;
    }
    var $newstep = $(html.step.format({cmd: '', name: 'unnamed'})); 
    $step.before($newstep);
    $newstep.focus();
  };

  function addStepAfter(step) {
    var $step = $(step);
    if ($step.data('sowl-cmd') === 'template') {
      return;
    }
    var $newstep = $(html.step.format({cmd: '', name: 'unnamed'})); 
    $step.after($newstep);
    $newstep.focus();
  };

  function addStepAsParent(step) {
    var $step = $(step);
    if ($step.data('sowl-cmd') === 'template') {
      return;
    }
    var $newstep = $(html.step.format({cmd: '', name: 'unnamed'})); 
    $step.before($newstep).detach().appendTo($newstep.find('.steps:first'));
    $newstep.focus();
  };

  function addStepAsChild(step) {
    var $step = $(step), 
        $newstep = $(html.step.format({cmd: '', name: 'unnamed'})); 
    $step.find('.steps:first').append($newstep);
    $newstep.focus();
    return $newstep;
  };

  function deleteStep(step) {
    var $step = $(step);
    // Keep the root
    //if ($step.data('sowl-cmd') === 'template') {
    //  $step.find('.steps:first').empty();
    //  return;
    //}
    // Find next focus
    var $focusme = $step.prev();
    if($focusme.length === 0) {
      $focusme = $step.next();
    }
    if($focusme.length === 0) {
      $focusme = $step.parent().closest('.step');
    }
    $step.remove();
    $focusme.focus();
  };

  function toggleStepEditor(step) {
    var $step = $(step),
        $editor = $step.closest('.editor');

    if ($step.hasClass('edited')) {
      $step.removeClass('edited');
    } else {
      // Update cmd select
      var cmd = $step.attr('data-sowl-cmd');
      if (cmd !== 'template') {
        setStepProperty($step, 'cmd', cmd);
      }
      // Show only one editor
      $editor.find('.step').removeClass('edited');
      $step.addClass('edited');
      // Scroll
      scrollStepIntoView(step);
    }
  };

  function notifyAardvark($step) {

    var result = "";
    $step.parents('.step').andSelf().children('.selector').filter(function(index, elem) {
      return $(elem).css('display') === 'block' && $(elem).text() !== '';
    }).each(function(index, elem){
      result = $(elem).text() + ' ' + result;
    });

    console.log('sending selector: ' + result + ' as context');
    $.sowl.port.callContext(result);
  }; 

  function scrollStepIntoView($step) {
    $step = $step instanceof jQuery ? $step : $($step);
    $step.children('.step-name').scrollintoview();
  };

  function setStepProperty($step, prop, value) {
    $step.children('.step-params').find('[name="{0}"]'.format(prop)).val(value).trigger('change');
  };

  function setResource($step, value) {
    var isProperty;
    try {
      isProperty = sowl.ontology.resources[value].isProperty();
    } catch (e) {}

    var cmd = $step.attr('data-sowl-cmd');
    if (cmd === 'template') {
      $step = addStepAsChild($step);
      setStepProperty($step, 'cmd', 'onto-elem');
      setStepProperty($step, 'typeof', value);
      return;
    }

    if (cmd === 'onto-elem') {
      if ( isProperty === true ) {
        // If we have onto-elem in onto-elem we rather assign the rel tag then create value-of
        if ($step.closest('.step').attr('data-sowl-cmd') === 'onto-elem' ) {
          setStepProperty($step, 'rel', value);
        } else {
          $step = addStepAsChild($step);
          setStepProperty($step, 'cmd', 'value-of');
          setStepProperty($step, 'property', value);
        }
      } else {
        setStepProperty($step, 'typeof', value);
      }
      return;
    }

    if (cmd === 'value-of') {
      setStepProperty($step, 'property', value);
      return;
    }
  }

  function setSelector($step, value) {
    // Set narrow when only selector is set
    if ($step.attr('data-sowl-cmd') === 'template') {
      $step = addStepAsChild($step);
      setStepProperty($step, 'cmd', 'narrow');
    }

    setStepProperty($step, 'selector', value);
  }

  //---------------------------------------------------------------------------

  function serializeSingleStep($step) {
    var result = {};

    result.command = ($step.attr('data-sowl-cmd') === 'template'
                       ? 'template'
                       : $step.children('.step-params').find('[name="cmd"]').val());

    $step.children('.step-params').children('div.param').filter(function(index, elem) {
      return $(elem).css('display') === 'block';
    }).find('input').each(function(index, elem) {
      var $input = $(elem);
      result[$input.attr('name')] = $input.val();
    });

    var steps = [];
    $step.children('.steps').children('.step').each(function(index, elem) {
      steps.push(serializeSingleStep($(elem)));
    });
    if(steps.length) {
      result.steps = steps;
    }

    // Handle selector transformation
    // Ugly as hell =/ 
    if (result.selector) {
      var arr = result.selector.split('@');
      // Will replace :eq(0) by :nth-child(1)
      var val = arr[0].trim().replace(/:eq\((\d+)\)/, function(match, num) {
        var nth = (+num) + 1;
        return ':nth-child('+nth+')';
      });
      var tmp = {
        value: val,
        type: "css",
      };
      if (arr.length > 1) {
        result.selector = {
          value: [
            tmp, 
            {
              value: '@'+arr[1], 
              type: 'xpath', 
            }
          ], 
          type: 'chained', 
        };
      } else {
        result.selector = tmp;
      }
    } else if (result.command === 'value-of' && result.selector === '') {
      resutl.selector = {
        value: '.',
        type: 'xpath',
      }
    }

    return result; 
  };

  function serializeTemplates($editor) {
    var result = [];
    $editor.find('[data-sowl-cmd="template"]', $editor).each(function(index, elem) {
      var template = serializeSingleStep($(this));
      delete template.commmand;
      result.push(template);
    });
    return result;
  };

  function serializeScenario($editor) {
    var result = {};

    var $settings = $editor.parents('.container').find('.settings');

    result.type = "scenario";
    result.name = $settings.find('input[name="name"]').val(), 

    result.ontology = {
      base: $settings.find('input[name="base"]').val(), 
    };

    result["call-template"] = {
      command: "call-template", 
      name: $settings.find('input[name="init"]').val(), 
      url: $settings.find('input[name="url"]').val(), 
    };

    result.templates = serializeTemplates($editor, result);

    return JSON.stringify(result, null, 2);
  };

  function addTemplate(name, $scenario) {
    var $editor = $('.editor', $scenario);
    var $step = loadHtml($editor, html.step, {},  true);
    $step.attr('data-sowl-cmd', 'template');
    $step.children('.step-name').text(name);
    $step.children('.step-params').find('[name="name"]').val(name);
    $step.focus();
  };

  function loadScenario(elem) {
    var $scenario = loadHtml(elem, html.scenario);
    var $settings = loadHtml($('.settings', $scenario), html.scenarioSettings);
    var $templates = loadHtml($('.templates', $scenario), html.templatesList);
    addTemplate('init', $scenario);
  };

  function initScenario($elem) {
    // Create new scenario
    loadScenario($elem);
    $elem.find('.editor').on('keydown', '.step', handlers.onStepKeyDown)
                         .on('keydown', '.step input', handlers.onStepInputKeyDown)
                         .on('dblclick', '.step', handlers.onStepDblclick)
                         .on('dblclick', '.step-name', handlers.onStepDblclick)
                         .on('focus', '.step', handlers.onStepFocus)
                         .on('blur', '.step', handlers.onStepBlur)
                         .on('dragover', '.step', handlers.onStepDragover)
                         .on('dragenter', '.step', handlers.onStepDragenter)
                         .on('dragenter', '.step-name', handlers.onStepDragenter)
                         .on('dragleave', '.step', handlers.onStepDragleave)
                         .on('drop', '.step', handlers.onStepDrop)
                         .on('mouseover', '.step', handlers.onStepMouseOver)
                         .on('mouseover', '.step-name', handlers.onStepMouseOver)
                         .on('change', 'select[name="cmd"]', handlers.onStepParamCmdChange)
                         .on('change', 'input[name="selector"]', handlers.onStepSelectorChange)
                         .on('change', '.step[data-sowl-cmd="template"] > .step-params input[name="name"]', handlers.onStepTemplateNameChange)
                         .on('change', '.step[data-sowl-cmd="onto-elem"] > .step-params input[name="typeof"]', handlers.onStepNameChange)
                         .on('change', '.step[data-sowl-cmd="value-of"] > .step-params input[name="property"]', handlers.onStepNameChange)
                         .on('change', '.step[data-sowl-cmd="call-template"] > .step-params input[name="name"]', handlers.onStepNameChange)
                         .on('mouseout', handlers.onEditorMouseOut)
                         .on('sowl-select', handlers.onSowlSelected);
    $elem.on('click', 'button[name="new-template"]', handlers.onNewTemplateClick)
         .on('click', 'button[name="start-selection"]', handlers.onStartSelectionClick);
    $elem.find('.settings').on('change', '[name="name"]', handlers.onScenarioNameChange);
    $elem.prop('scenario', scenario);
  }

  var handlers = {

    onStepDrop: function onStepDrop(event) {
      event.preventDefault();
      event.stopPropagation();

      $step = $(this);

      $step.closest('.editor').find('.step').removeClass('dragover');

      if (~$.inArray('sowl/resource-uri', event.dataTransfer.types)) {
        setResource($step, event.dataTransfer.getData('sowl/resource-uri'));
      }

      if (~$.inArray('sowl/target-selector', event.dataTransfer.types)) {
        setSelector($step, event.dataTransfer.getData('sowl/target-selector'));
      }

      $step.focus();
      return false;
    }, 

    onStepDragenter: function onStepDragenter(event) {
      event.stopPropagation();
      var $step = $(event.target)
      if ($step.hasClass('step-name')) {
        $step = $step.parent();
      }
      $step.closest('.editor').find('.step').removeClass('dragover');
      $step.addClass('dragover');
      return false;
    }, 

    onStepDragleave: function onStepDragleave(event) {
      event.stopPropagation();
      $(event.target).removeClass('dragover');
      return false;
    }, 

    onStepDragover: function onStepDragover(event) {
      if (//~$.inArray('application/x-moz-file', event.dataTransfer.types) ||
          ~$.inArray('sowl/resource-uri', event.dataTransfer.types) ||
          ~$.inArray('sowl/target-selector', event.dataTransfer.types)) {
        event.preventDefault();
        return false;
      }
    }, 


    onStepFocus: function onStepFocus(event) {
      var $step = $(event.target),
          $editor = $step.closest('.editor'),
          opts = { view: $editor.get(0)  };
      // Focus
      $editor.find('.step').removeClass('current');
      $step.addClass('current');
      // Scrolling
      scrollStepIntoView($step);
      notifyAardvark($step);
    }, 

    onStepBlur: function onStepBlur(event) {
      // This was nonsense ;)
      $(event.target).removeClass('current');
    }, 


    onStepDblclick: function onStepDblclick(event) {
      event.preventDefault();
      var $step = $(event.target);
      if ($step.hasClass('step-name')) {
        $step = $step.parent();
      }
      toggleStepEditor($step);
      return false;
    }, 

    onStepMouseOver: function onStepMouseOver(event) {
      var $step = $(event.target);
      if ($step.hasClass('step-name')) {
        $step = $step.parent();
      }
      $step.closest('.editor').find('.step').removeClass('hover');
      $step.addClass('hover');
    },

    onEditorMouseOut: function onEditorMouseOut(event) {
      $(event.target).find('.step').removeClass('hover');
    }, 

    onStepKeyDown: function onStepKeyDown(event) {
      if (event.which === 65) { // a,A
        // Not handling Ctrl+a, Alt+a
        if (event.ctrlKey || event.altKey) {
          return true;
        }
        event.preventDefault();
        if (!event.shiftKey) { // a
          var $newstep = addStepAfter(event.target);
          $newstep.focus();
          return false;
        } else {               // A
          var $newstep = addStepAsChild(event.target);
          $newstep.focus();
          return false;
        }
      }
      if (event.which === 73) {
        event.preventDefault();
        if (!event.shiftKey) { // i
          addStepBefore(event.target);
          return false;
        } else {               // I
          addStepAsParent(event.target);
          return false;
        }
      }
      if (event.which === 68) { // d
        return handlers.onDeletePressed(event);
      }
      if (event.which === 72) { // h
        return handlers.onLeftArrowPressed(event);
      }
      if (event.which === 74) { // j
        if(!event.shiftKey && !event.ctrlKey) {
          return handlers.onDownArrowPressed(event);
        }
      }
      if (event.which === 75) { // k
        return handlers.onUpArrowPressed(event);
      }
      if (event.which === 76) { // l
        return handlers.onRightArrowPressed(event);
      }
      if (event.which === 83) { // s
        if (event.ctrlKey) {
          event.preventDefault();
          return handlers.onScenarioSave(event);
        }
      }
      if (event.which === 37) {
        return handlers.onLeftArrowPressed(event);
      }
      if (event.which === 38) {
        return handlers.onUpArrowPressed(event);
      }
      if (event.which === 39) {
        return handlers.onRightArrowPressed(event);
      }
      if (event.which === 40) {
        return handlers.onDownArrowPressed(event);
      }
      if (event.which === 13) {
        if (event.ctrlKey) {
          return handlers.onCtrlEnterPressed(event);
        }
      }
      if ((event.which === 8 || event.which === 46) && !event.heldDown) {
        return handlers.onDeletePressed(event);
      }
    }, 

    onStepInputKeyDown : function onStepInputKeyDown(event) {
      event.stopPropagation();
      return true;
    }, 

    onLeftArrowPressed: function onLeftArrowPressed(event) {
      event.preventDefault();
      var $step = $(event.target);
      var $target = $step.parent().closest('.step');
      if($target.length > 0) {
        $target.focus();
      }
      return false;
    }, 

    onDownArrowPressed: function onDownArrowPressed(event) {
      event.preventDefault();
      var $step = $(event.target), 
          $parent = $step,
          $target = $step.next('.step');
      if ($target.length > 0) {
        $target.focus();
      } // else {
      //  // Focus parent if we have one
      //  $step.parent().closest('.step').focus();
      //}
      //while ($target.length === 0) {
      //  var $parent = $parent.parent().closest('.step');
      //  if ($parent.length === 0) {
      //    return;
      //  } else {
      //    $target = $parent.next('.step');
      //  }
      //}
      $target.focus();
      return false;
    }, 

    onUpArrowPressed: function onUpArrowPressed(event) {
      event.preventDefault();
      var $step = $(event.target);
      var $target = $step.prev('.step');
      if ($target.length > 0) {
        $target.focus();
      }
      //else {
      //  // Focus parent if we have one
      //  $step.parent().closest('.step').focus();
      //}
      return false;
    }, 

    onRightArrowPressed: function onRightArrowPressed(event) {
      event.preventDefault();
      var $step = $(event.target);
      var $target = $step.find('.steps .step').first();
      if($target.length > 0) {
        $target.focus();
      }
      return false;
    }, 
     
    onDeletePressed: function onDeletePressed(event) {
      event.preventDefault();
      deleteStep(event.target);
      return false;
    }, 

    onCtrlEnterPressed: function onCtrlEnterPressed(event) {
      event.preventDefault();
      toggleStepEditor(event.target);
      return false;
    }, 

    onScenarioSave: function onScenarioSave(event) {
      var scenario_data = serializeScenario($(event.target).closest('.editor'));
      $.sowl.port.callScenarioSave( scenario_data );
      return false;
    }, 

    onStepParamCmdChange: function onStepParamCmdChange(event) {
      var $cmd = $(event.target);
      $cmd.closest('.step').attr('data-sowl-cmd', $cmd.val());
    }, 

    onStepTemplateNameChange: function onStepTemplateNameChange(event) {
      var $input = $(event.target), 
          $step = $input.closest('.step'),
          from = $step.children('.step-name').text(),
          to = $input.val();

      $step.children('.step-name').text(to)
      // refactor init
      // refactor call-templates
    }, 

    onStepNameChange: function onStepCreateNameChange(event) {
      var $input = $(event.target), 
          $step = $input.closest('.step');
      $step.children('.step-name').text($input.val());
    }, 

    onStepSelectorChange: function onStepSelectorChange(event) {
      var $input = $(event.target), 
          $step = $input.closest('.step');
      $step.children('.selector').text($input.val());
    }, 

    onNewTemplateClick: function onNewTemplateClick(event) {
      var $scenario = $(event.target).parents('.container');
      addTemplate('unnamed', $scenario);
    }, 

    onScenarioNameChange: function onScenarioNameChange(event) {
      var $inp = $(event.target), 
          name = $inp.val(), 
          $scenario = $inp.parents('.container').children('.header').find('.topic .name').text(name);
    }, 

    onStartSelectionClick: function onStartSelectionClick(event) {
      $.sowl.port.startSelection();
    }, 

  };

  $.fn.scenario = function(options) {
    initScenario(this);
    return this;
  };

})(jQuery);
