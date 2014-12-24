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
    '          <div class="step-properties">', 
    '            the properties', 
    '          </div>', 
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

  function addStepBefore(step) {
    var $step = $(step);
    if ($step.hasClass('template')) {
      return;
    }
    var $newstep = $(html.step.format({cmd: '', name: 'unnamed'})); 
    $step.before($newstep);
    $newstep.focus();
  };

  function addStepAfter(step) {
    var $step = $(step);
    if ($step.hasClass('template')) {
      return;
    }
    var $newstep = $(html.step.format({cmd: '', name: 'unnamed'})); 
    $step.after($newstep);
    $newstep.focus();
  };

  function addStepAsParent(step) {
    var $step = $(step);
    if ($step.hasClass('template')) {
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
  };

  function deleteStep(step) {
    var $step = $(step);
    // Keep the root
    if ($step.hasClass('template')) {
      $step.find('.steps:first').empty();
      return;
    }
    // Find next focus
    var $focusme = $step.prev();
    if($focusme.length === 0) {
      $focusme = $step.parent().closest('.step');
    }
    //TODO delete step from inner repre..?
    $step.remove();
    $focusme.focus();
  };

  function toggleEditor(step) {
    var $step = $(step),
        $editor = $step.closest('.editor');

    //TODO delme
    console.log('doubleclicked on: ' + step + ' : ' + $step.html());

    if ($step.hasClass('edited')) {
      $step.removeClass('edited');
    } else {
      $editor.find('.step').removeClass('edited');
      $step.addClass('edited');
      scrollStepIntoView(step);
    }
  };

  function scrollStepIntoView($step) {
    $step = $step instanceof jQuery ? $step : $($step);
    $step.children('.step-name').scrollintoview();
  };

  //function addStep(step, templateName, $steps) {
  //  //TODO instead of scenario use the "steps" container already
  //  //var $template = $('.editor .template[name="{0}"]'.format(templateName))
  //  loadHtml($steps, html.step, step, true);
  //};

  function addTemplate(name, template, $scenario) {
    loadHtml($('.template-list', $scenario), html.templatesListItem, {value: name}, true);
    var $tmp = loadHtml($('.editor', $scenario), html.templateEditor, {name: name},  true);
    var step = template.getRootStep();
    var $step = loadHtml($tmp, html.step, {cmd: step.getCmd(), name: name},  true);

    //TODO DELME vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv
    var $steps = $step.find('.steps:first');
    var $onto = loadHtml($steps, html.step, {cmd: 'onto-elem', name: 'first'},  true).find('.steps');
    loadHtml($onto, html.step, {cmd: 'value-of', name: 'child1'},  true);
    loadHtml($onto, html.step, {cmd: 'value-of', name: 'child2'},  true);
    var $onto = loadHtml($steps, html.step, {cmd: 'onto-elem', name: 'second'},  true).find('.steps');
    loadHtml($onto, html.step, {cmd: 'value-of', name: 'child1'},  true);
    loadHtml($onto, html.step, {cmd: 'value-of', name: 'child2'},  true);
    loadHtml($onto, html.step, {cmd: 'value-of', name: 'child3'},  true);
    loadHtml($onto, html.step, {cmd: 'value-of', name: 'child4'},  true);
    // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

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

  function initScenario($elem) {
    // Create new scenario
    var scenario = $.sowl.scenario();
    loadScenario($elem, scenario);
    $elem.find('.editor').on('keydown', '.step', handlers.onStepKeyDown)
                         .on('dblclick', '.step', handlers.onStepDblclick)
                         .on('focus', '.step', handlers.onStepFocus)
                         .on('blur', '.step', handlers.onStepBlur)
                         .on('dragover', '.step', handlers.onStepDragover)
                         .on('dragenter', '.step', handlers.onStepDragenter)
                         .on('dragleave', '.step', handlers.onStepDragleave)
                         .on('drop', '.step', handlers.onStepDrop)
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

      var data = event.dataTransfer.getData('sowl/resource-uri') || event.dataTransfer.getData('sowl/target-selector');
      $step.find('.step-name').first().text(data);

      $step.focus();

      return false;
    }, 

    onStepDragenter: function onStepDragenter(event) {
      event.stopPropagation();
      $(event.target).addClass('dragover');
      return false;
    }, 

    onStepDragleave: function onStepDragleave(event) {
      event.stopPropagation();
      $(event.target).removeClass('dragover');
      return false;
    }, 

    onStepDragover: function onStepDragover(event) {
      event.preventDefault();
      /* preventDefault to allow drop */
      //$(event.target).addClass('dragover');
      return false;
    }, 

    onStepFocus: function onStepFocus(event) {
      var $step = $(event.target),
          $editor = $step.closest('.editor'),
          opts = { view: $editor.get(0)  };
      // Focus
      $editor.find('.step').removeClass('current');
      $step.addClass('current');
      console.log('thinking about scrolling');
      // Scrolling
      scrollStepIntoView($step);
    }, 

    onStepBlur: function onStepBlur(event) {
      // This was nonsense ;)
      //$(event.target).removeClass('current');
    }, 

    onStepDblclick: function onStepDblclick(event) {
      event.preventDefault();
      toggleEditor(event.target);
      return false;
    }, 

    onStepKeyDown: function onStepKeyDown(event) {
      if (event.which === 65) {
        event.preventDefault();
        if (!event.shiftKey) { // a
          addStepAfter(event.target);
          return false;
        } else {               // A
          addStepAsChild(event.target);
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
        return handlers.onDownArrowPressed(event);
      }
      if (event.which === 75) { // k
        return handlers.onUpArrowPressed(event);
      }
      if (event.which === 76) { // l
        return handlers.onRightArrowPressed(event);
      }
      //if (event.which === 27) { // Esc
      //  return handlers.onEscapePressed(event);
      //}
      //if (event.which === 9) { // Tab
      //  return handlers.onTabPressed(event);
      //}
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
        //return handlers.onEnterPressed(event);
      }
      //if (event.which === 78) {
      //  return handlers.onNPressed(event);
      //}
      //if (event.which === 32) {
      //  return handlers.onSpacePressed(event);
      //}
      //if (event.which === 84) {
      //  return handlers.onTPressed(event);
      //}
      //if (event.which === 70) {
      //  return handlers.onFPressed(event);
      //}
      //if (event.which === 90) {
      //  return handlers.onZPressed(event);
      //}
      if ((event.which === 8 || event.which === 46) && !event.heldDown) {
        return handlers.onDeletePressed(event);
      }
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
      toggleEditor(event.target);
      return false;
    }, 

    onSowlSelected: function onSowlSelected(event) {
      var selector = event.selector, 
          uri = event.uri, 
          $editor = $(this), 
          $current = $editor.find('.step.current'); 
      if ($current.length === 0) {
        $current = $editor.find('.step.template');
      }
      //TODO !!!
      //$current.addChildStep(selector, uri);
      console.log('I\'d like to add some step now');
    }, 

  };

  $.fn.scenario = function(options) {
    initScenario(this);
    return this;
  };

})(jQuery);

