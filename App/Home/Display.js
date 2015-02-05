//
// exports window.IGC.Api
//
(function($){

  window.IGC = window.IGC || {};
  window.App = window.App || {};
  window.Debug = window.Debug || {};
  var cachedStyleguides = [];

  String.prototype.replaceAll = function(search, replace) {
    return this.split(search).join(replace);
  }

  var throttle = (function(){
    var timer = 0;
    return function(callback, ms){
      clearTimeout (timer);
      timer = setTimeout(callback, ms);
    };
  })();

  var Display = {
    initContainers: function(){
      App.$items = $('.item-list');
      App.$select = $('#styleguide-select');
      App.$styleguideBtn = $('#goto-styleguide');
      App.$refreshSuggestions = $('#refresh-suggestions');
      App.$settingsTrigger = $('#settings-trigger');
      App.$homeTrigger = $('#trigger-home');
      App.$settingsTab = $('[data-settings-tab]');
      App.$resultsTab = $('[data-results-tab]');
      App.$styleguideQuery = $('#styleguide-query-input')
      App.$autoRun = $('#toggle-autorun');
      App.$toolTips = $('[data-tool-tip]');

      App.$toolTips.tipr();

      App.$autoRun.prop('checked', localStorage.autoRun === "true");
      App.$autoRun.on('change', function() {
        localStorage.autoRun = !(localStorage.autoRun === "true");
        App.toggleAutoRun();
      });

      App.$select.on('click', 'li', function() {
        var value = $(this).data('save-guide-id');
        App.forceGrabSuggestions();
        Display.showStyleguide(value);
        App.setStyleguideState(value);
        Display.showStyleguides(cachedStyleguides);
      });

      App.$settingsTrigger.on('click', function() {
        App.$resultsTab.addClass('hidden');

        setTimeout(function(){
          App.$settingsTab.removeClass('hidden');
        }, 100);
      });

      App.$homeTrigger.on('click', function() {
        App.$settingsTab.addClass('hidden');

        setTimeout(function(){
          App.$resultsTab.removeClass('hidden');
        }, 100);
      });

      App.$styleguideQuery.on('keyup', function() {
        throttle(function(){
          IGC.Api.getStyleguides(window.App.Display.showStyleguides, App.$styleguideQuery.val());
        }, 1000 );
      });

      Display.showStyleguide(localStorage.styleguide)
      App.$refreshSuggestions.on('click', App.forceGrabSuggestions);
    },
    showLoadingNotification: function() {
      if($('#loading-notification').length === 0) {
        var template = '<li id="loading-notification"><div class="container"><h3>Loading Matches</h3>' +
                         '<p>Please wait...</p></div></li>';
        App.$items.prepend(template);
      }
    },
    hideLoadingNotification: function() {
      if($('#loading-notification').length) {
        $('#loading-notification').remove();
      }
    },
    styleguideTemplate: function(styleguide){
      var classes = '',
          span = '';
      if(parseInt(styleguide.id) === parseInt(App.getStyleguideState())) {
        classes += 'chosen-guide';
        span = '<span class="check">&#x2713;</span>'
      }

      return '<li class="' + classes + '" data-save-guide-name="' + styleguide.name +
              '" data-save-guide-id=' + styleguide.id + '>' +
                      styleguide.name + span + 
              "</li>";
    },
    showTips: function(response) {
      App.$items.html('');

      for(var tipIndex in response) {
        App.$items.append(new App.Tip(response[tipIndex]).render());
      }

      if(response.length === 0) {
        App.$items.html(new App.Tip({  matched_string: '<h4 class="no-results">No results, you have quite the way with words!</h4>' }).fillerMessage());
      }
    },
    showStyleguides: function(styleguides) {
      cachedStyleguides = styleguides;

      var selected = App.getStyleguideState();
      App.$select.html('');

      for(var guideIndex in styleguides) {
        App.$select.append(Display.styleguideTemplate(styleguides[guideIndex]));
      }
    },
    showStyleguide: function(styleguideId) {

      var url = '#';
      if(styleguideId == 0) {
        App.$styleguideBtn.addClass('hidden');
      } else {
        url = App.baseUrl + 'style_guides/' + styleguideId;
        App.$styleguideBtn.removeClass('hidden');
      }
      App.$styleguideBtn.attr('href', url);
    },
    showMessageBody: function(message) {
      console.log(message);
    },
    showErrors: function(message) {
      Debug.showMessage(message);
      console.log(message);
    }
  };

  window.App.Display = Display;

})(jQuery);