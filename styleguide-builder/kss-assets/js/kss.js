$('.kss-colors-container').closest('.kss-documentation').addClass('-kss-colors-section');
$('.kss-icons-container').closest('.kss-documentation').addClass('-kss-icons-section');

(function() {
  var KssStateGenerator;

  KssStateGenerator = (function() {
    var pseudo_selectors;

    pseudo_selectors = ['hover', 'enabled', 'disabled', 'active', 'visited', 'focus', 'target', 'checked', 'empty', 'first-of-type', 'last-of-type', 'first-child', 'last-child'];

    function KssStateGenerator() {
      var idx, idxs, pseudos, replaceRule, rule, stylesheet, _i, _len, _len2, _ref, _ref2;
      pseudos = new RegExp("(\\:" + (pseudo_selectors.join('|\\:')) + ")", "g");
      try {
        _ref = document.styleSheets;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          stylesheet = _ref[_i];
          if (stylesheet.href && stylesheet.href.indexOf(document.domain) >= 0) {
            idxs = [];
            _ref2 = stylesheet.cssRules;
            for (idx = 0, _len2 = _ref2.length; idx < _len2; idx++) {
              rule = _ref2[idx];
              if ((rule.type === CSSRule.STYLE_RULE) && pseudos.test(rule.selectorText)) {
                replaceRule = function(matched, stuff) {
                  return matched.replace(/\:/g, '.pseudo-class-');
                };
                this.insertRule(rule.cssText.replace(pseudos, replaceRule));
              }
              pseudos.lastIndex = 0;
            }
          }
        }
      } catch (_error) {}
    }

    KssStateGenerator.prototype.insertRule = function(rule) {
      var headEl, styleEl;
      headEl = document.getElementsByTagName('head')[0];
      styleEl = document.createElement('style');
      styleEl.type = 'text/css';
      if (styleEl.styleSheet) {
        styleEl.styleSheet.cssText = rule;
      } else {
        styleEl.appendChild(document.createTextNode(rule));
      }
      return headEl.appendChild(styleEl);
    };

    return KssStateGenerator;

  })();

  new KssStateGenerator;

}).call(this);



// custom code.
(function() {

  var kssDocumentation = '.kss-documentation',
    kssHamburger = '.kss-header-hamburger';

  // navigation.
  $('.kss-header-hamburger-trigger').on('click', function(e) {

    if ($('body').hasClass('kss-state-active')) {
      $('body').removeClass('kss-state-active');
      $(kssDocumentation).removeClass('kss-state-active');
    } else {
      $('body').addClass('kss-state-active');
      $(kssDocumentation).addClass('kss-state-active');
    }

    if ($(kssHamburger).hasClass('kss-state-active')) {
      $(kssHamburger).removeClass('kss-state-active');
    } else {
      $(kssHamburger).addClass('kss-state-active');
    }
  });

  $(window).on('resize', function() {
    $('body').removeClass('kss-state-active');
    $(kssDocumentation).removeClass('kss-state-active');
    $(kssHamburger).removeClass('kss-state-active');
  });


  // smooth scrolling.
  (function smoothScrolling() {

    $('.kss-nav-item > a[href*=section]').on('click', function(e) {

      $('body').removeClass('kss-state-active');
      $(kssDocumentation).removeClass('kss-state-active');
      $(kssHamburger).removeClass('kss-state-active');

      $(this).parent().siblings().children('a').removeClass('kss-state-active');
      $(this).addClass('kss-state-active');

      if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');

        if (target.length) {

          var offsetY = target.offset().top;

          if ($(window).width() < 1300) {
            offsetY = target.offset().top - 80;
          }

          setTimeout(function() {
            $('html, body').animate({
              scrollTop: offsetY
            }, 500);
          }, 200);

          return false;
        }
      }
    });
  })();

  $(function() {

    setTimeout(function() {

      $('.kss-section-function').map(function(index, el) {

        $(el).find('.token.punctuation:contains("{")').filter(':first').addClass('function-chopper').html('{ <span class="token dots">...</span> }');

        var ht = $(el).find('pre code').height() + 32;
        $(el).find('pre').outerHeight(56);

        $(el).find('pre').on('click', function() {
          if ($(this).attr('data-visible') != 'true') {
            $(this).attr('data-visible', 'true');
            $(this).outerHeight(ht);
            $(this).next().text('Click to Collapse');
          } else {
            $(this).attr('data-visible', 'false');
            $(this).outerHeight(56);
            $(this).next().text('Click to Expand');
          }
        });

      });

      $('.toolbar').prepend('<label class="switch-light switch-ios"><input type="checkbox"><span><span>Dark</span><span>Light</span><a></a></span></label>');

      $('.switch-light > span').on('click', function() {
        if ($('body').hasClass('-dark-syntax')) {
          $('body').removeClass('-dark-syntax');
        } else {
          $('body').addClass('-dark-syntax');
        }
      });
    }, 200);

  });

  (function() {

    // Build toc as an array.
    var tocList = function($listItems) {
      var list = [];
      $listItems.each(function() {
        var $this = $(this);

        properties = {
          name: $this.data('name'),
          url: $this.data('url')
        };

        if ($this.data('type')) {
          properties.type = $this.data('type');
        }
        list.push(properties);
      });
      return list;
    };

    // Setup easy-autocomplete options.
    var options = {
      data: tocList($('#kss-toc li')),
      placeholder: "Search...",
      getValue: function(element) {
        return element.name;
      },
      list: {
        match: {
          enabled: true
        },
        onKeyEnterEvent: function() {
          const sectionURL = $('#kss-search').getSelectedItemData().url;
          window.location = sectionURL;
        }
      },
      template: {
        type: "custom",
        method: function(value, item) {
          var suggestion;
          if (item.type) {
            suggestion = "<a class='kss-eac-item-link' href='" + item.url + "' >" + value + "<span> - <em>" + item.type + "</em></span></a>";
          } else {
            suggestion = "<a class='kss-eac-item-link' href='" + item.url + "' >" + value + "</a>";
          }
          return suggestion;
        }
      }
    };

    // Initiate the search field.
    $('#kss-search').easyAutocomplete(options);



  })();

})();
