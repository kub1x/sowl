/*
 * Viewport - jQuery selectors for finding elements in viewport
 *
 * Copyright (c) 2008-2009 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *  http://www.appelsiini.net/projects/viewport
 *
 */
(function($) {
    
    $.belowthefold = function(element, settings) {
        var view = settings.view || window;
        var fold = $(view).height() + $(view).scrollTop();
        return fold <= $(element).offset().top - settings.threshold;
    };

    $.abovethetop = function(element, settings) {
        var view = settings.view || window;
        var top = $(view).scrollTop();
        return top >= $(element).offset().top + $(element).height() - settings.threshold;
    };
    
    $.rightofscreen = function(element, settings) {
        var view = settings.view || window;
        var fold = $(view).width() + $(view).scrollLeft();
        return fold <= $(element).offset().left - settings.threshold;
    };
    
    $.leftofscreen = function(element, settings) {
        var view = settings.view || window;
        var left = $(view).scrollLeft();
        return left >= $(element).offset().left + $(element).width() - settings.threshold;
    };
    
    $.inviewport = function(element, settings) {
        return !$.rightofscreen(element, settings) &&
               !$.leftofscreen(element, settings) &&
               !$.belowthefold(element, settings) &&
               !$.abovethetop(element, settings);
    };
    
    $.extend($.expr[':'], {
        "below-the-fold": function(a, i, m) {
            return $.belowthefold(a, {threshold : 0});
        },
        "above-the-top": function(a, i, m) {
            return $.abovethetop(a, {threshold : 0});
        },
        "left-of-screen": function(a, i, m) {
            return $.leftofscreen(a, {threshold : 0});
        },
        "right-of-screen": function(a, i, m) {
            return $.rightofscreen(a, {threshold : 0});
        },
        "in-viewport": function(a, i, m) {
            return $.inviewport(a, {threshold : 0});
        }
    });

    
})(jQuery);
