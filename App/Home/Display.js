//
// exports window.IGC.Api
//
(function($){

  window.IGC = window.IGC || {};
  window.App = window.App || {};

  String.prototype.replaceAll = function(search, replace) {
    return this.split(search).join(replace);
  }

  var Display = {
    initContainers: function(){
      App.$items = $('.item-list');
      App.$select = $('#styleguide-select');
      App.$refreshSuggestions = $('#refresh-suggestions');
      App.$select.on('change', App.forceGrabSuggestions);
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
    tipTemplate: function(tip) {
      var str = '<li><div class="container"><h3>' + 
                  '<a href="' + App.baseUrl + '#!/tip/"' + tip.id + ' target="_blank" class="more-link"> more</a>' +
                  tip.matched_string + '</h3>';

      if(tip.replacements && tip.replacements.length) {
        var replacements = tip.replacements;
        str += '<div><span class="tip-replacement-text">Replace with: </span><ul class="tip-replacements">';
        for(var replacement in replacements) {
          str += '<li>' + replacements[replacement] + '</li>';
        }
        str += '</ul></div>';
      }

      str += '<p>' + tip.explanation + '</p></div></li>';
      return str;
    },
    styleguideTemplate: function(styleguide){
      return '<option value="' + styleguide.id + '">' + styleguide.name + '</option>';
    },
    showTips: function(response) {
      App.$items.html('');

      for(var tipIndex in response) {
        App.$items.append(Display.tipTemplate(response[tipIndex]));
      }

      if(response.length === 0) {
        App.$items.html(Display.tipTemplate('No improvements necessary', ''));
      }
    },
    showStyleguides: function(styleguides) {
      var selected = App.$select.val() || 0;
      App.$select.html(Display.styleguideTemplate({ id: 0, name: 'Select a styleguide' }));

      for(var guideIndex in styleguides) {
        App.$select.append(Display.styleguideTemplate(styleguides[guideIndex]));
      }

      App.$select.val(selected);
    },
    showMessageBody: function(message) {
      console.log(message);
    },
    showErrors: function(message) {
        console.log(message);
    }
  };

  App.Display = Display;

})(jQuery);