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
    '              </select>', 
    '            </div><br />', 
    '            <div class="param name">     <label for="name">     name:</label>     <input type="text" name="name" value="unnamed" /></div><br />', 
    '            <div class="param typeof">   <label for="typeof">   type:</label>     <input type="text" name="typeof"   /></div><br />', 
    '            <div class="param selector"> <label for="selector"> selector:</label> <input type="text" name="selector" /></div><br />', 
    '            <div class="param property"> <label for="property"> property:</label> <input type="text" name="property" /></div><br />', 
    '          </div>', 
    '          <div class="steps">', 
    '          </div>', 
    '        </div>', 
  ].join('\n');

  function loadHtml(elem, html, data, isAppend = false) {
    if (data) {
      //console.log('populating html:\n' + html + '\n\nwith data:\n' + JSON.stringify(data, null, 2));
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
    if ($step.data('sowl-cmd') === 'template') {
      $step.find('.steps:first').empty();
      return;
    }
    // Find next focus
    var $focusme = $step.prev();
    if($focusme.length === 0) {
      $focusme = $step.next();
    }
    if($focusme.length === 0) {
      $focusme = $step.parent().closest('.step');
    }
    //TODO delete step from inner repre..?
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
      $step.children('.step-params').find('[name="cmd"]').val(cmd);
      // Show only one editor
      $editor.find('.step').removeClass('edited');
      $step.addClass('edited');
      // Scroll
      scrollStepIntoView(step);
    }
  };

  function scrollStepIntoView($step) {
    $step = $step instanceof jQuery ? $step : $($step);
    $step.children('.step-name').scrollintoview();
  };

  function setResource($step, value) {
    var isProperty;
    try {
      isProperty = sowl.ontology.resources[value].isProperty();
    } catch (e) {}

    if ($step.data('sowl-cmd') === 'onto-elem') {
      if ( isProperty === true ) {
        $step = addStepAsChild($step);
        $step.find('.step-params:first [name="cmd"]').val('value-of').trigger('change');
        $step.find('.step-params:first input[name="property"]').val(value).trigger('change');
      } else {
        $step.find('.step-params:first input[name="typeof"]').val(value).trigger('change');
      }
    }

    if ($step.data('sowl-cmd') === 'value-of') {
      $step.find('.step-params:first input[name="property"]').val(value).trigger('change');
    }
  }

  function setSelector($step, value) {
    $step.find('.step-params:first > .selector input').val(value).trigger('change');
  }

  //---------------------------------------------------------------------------

  function serializeSingleStep($step) {
    console.log('serializeSingleStep('+$step+')');
    var result = {};

    result.commmand = $step.children('.step-params').find('[name="cmd"]').val();

    $step.children('.step-params').children('div.param').filter(function(index, elem) {
      console.log('filtering by: ' + this.style.display);
      console.log('filtering jq: ' + $(elem).css('display'));
      return $(elem).css('display') === 'block';
    }).find('input').each(function(index, elem) {
      console.log('each input');
      var $input = $(elem);
      result[$input.attr('name')] = $input.val();
    });

    var steps = [];
    $step.children('.steps').children('.step').each(function(index, elem) {
      steps.push(serializeSingleStep($(elem)));
    });
    result.steps = steps;

    return result; 
  };

  function serializeTemplates($editor) {
    console.log('serializeTemplates('+$editor+')');
    var result = [];
    $editor.find('[data-sowl-cmd="template"]', $editor).each(function(index, elem) {
      var template = serializeSingleStep($(this));
      delete template.commmand;
      result.push(template);
    });
    return result;
  };

  function serializeScenario($editor) {
    console.log('serializeScenario('+$editor+')');
    var result = {};
    //TODO put scenario stuff in here (url, name)

    result.templates = serializeTemplates($editor, result);

    return JSON.stringify(result, null, 2);
  };

  function renameTemplate(from, to, $editor_container) {
    var $editor = $editor_container.children('.editor'), 
        $tl = $editor_container.find('.template-list'), 
        sel = 'option[value="{0}"]'; 

    if($tl.find(sel.format(to)).length) {
      alert('Template with name ' + to + ' already exists. ');
      return;
    }

    // Rename the option in dropdown
    var $opt = $tl.find(sel.format(from));
    $opt.attr('value', to);
    $opt.text(to);
    $tl.val(to);

    // Rename in place
    var $tpl = $editor.children().has('.step-name:first:contains({from})'.format({from:from}));
    $tpl.children('.step-name').text(to);
    $tpl.children('.step-params').find('[name="name"]').val(to);
  };

  function addTemplate(name, $scenario) {
    loadHtml($('.template-list', $scenario), html.templatesListItem, {value: name}, true);
    var $editor = loadHtml($('.editor', $scenario), html.step, {},  true);
    var $step = $editor.children('.step');
    $step.attr('data-sowl-cmd', 'template');
    $step.children('.step-name').text(name);
    $step.children('.step-params').find('[name="name"]').val(name);
    $step.focus();
  };

  function loadScenario(elem) {
    console.log('loading scenario html');
    var $scenario = loadHtml(elem, html.scenario, { name: 'unnamed' });
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
    $elem.prop('scenario', scenario);
  }

  var handlers = {

    onStepDrop: function onStepDrop(event) {
      event.preventDefault();
      event.stopPropagation();

      $step = $(this); // $(event.target);

      //TODO ugly.. nicer
      $step.closest('.editor').find('.step').removeClass('dragover');

      console.log('dropped data on step:' + $step.find('.step-name').first().text());
      console.log('dropped data [sowl/resource-uri]:' + event.dataTransfer.getData('sowl/resource-uri'));
      console.log('dropped data [sowl/target-selector]:' + event.dataTransfer.getData('sowl/target-selector'));

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
    }, 

    onStepBlur: function onStepBlur(event) {
      // This was nonsense ;)
      //$(event.target).removeClass('current');
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
      //NOTE this isn't much nice
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
      console.log('cmd changed:'+$cmd.val());
      $cmd.closest('.step').attr('data-sowl-cmd', $cmd.val());
    }, 

    onStepTemplateNameChange: function onStepTemplateNameChange(event) {
      console.log('onStepTemplateNameChange fired');
      var $input = $(event.target), 
          $step = $input.closest('.step'),
          from = $step.children('.step-name').text(),
          to = $input.val();
      renameTemplate(from, to, $step.closest('.editor-container'));
    }, 

    onStepNameChange: function onStepCreateNameChange(event) {
      console.log('onStepCreateNameChange');
      var $input = $(event.target), 
          $step = $input.closest('.step');
      $step.children('.step-name').text($input.val());
    }, 

    onStepSelectorChange: function onStepSelectorChange(event) {
      console.log('onStepSelectorChange');
      var $input = $(event.target), 
          $step = $input.closest('.step');
      $step.children('.selector').text($input.val());
    }, 

  };

  $.fn.scenario = function(options) {
    initScenario(this);
    return this;
  };

})(jQuery);

