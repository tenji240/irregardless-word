/// <reference path="../App.js" />
/*global app*/

;(function () {
  'use strict';

  window.App = window.App || {};
 
  var Stub = {
    message: "We should sit down with a googler about this trivial issue.",
    tips: [{ id: 281, index: 0, replacements: [], match_string: 'we', matched_string: 'we', explanation: 'As in “We now know the fatality ratio of the current H1N1 influenza epidemic.” In the context of an article, "we" includes not just you and other H1N1 experts, but also your readers, most of whom don’t know this fact–yet.' },
             { id: 366, index: 10, replacements: [], match_string: 'sit down with', matched_string: 'sit down with', explanation: '"sit down with" often used to meen "meet with"; for example, "http://talkingpointsmemo.com/livewire/nbc-brian-williams-edward-snowden-glenn-greenwald". "Sit down with" could imply a variety of activities. Say "meet" or "interview".' },
       { id: 341, index: 26, replacements: [], match_string: 'googler', matched_string: 'googler', explanation: "Unnecessarily casual, if that's actually a thing." },
       { id: 344, index: 45, replacements: [], match_string: 'trivial', matched_string: 'trivial', explanation: 'Trivial suggests either trivia or utter insignificance. Stay away from nontrivial, too.' }],
    styleguides: [{ id: 1, name: 'Everything' }, { id: 2, name: 'Dosty\'s Guide' },
                  { id: 3, name: 'Redpen Tips' }, { id: 4, name: 'New School' }],

    forceGrabSuggestions: function() {
      window.App.Display.showTips(Stub.tips);
    }
  }
  
  var Debug = {
    debugging: false,
    showMessage: function(msg) {
      if(!Debug.debugging) return;
      Debug.removeDebugNotification();
      var template = '<li id="debug-notification"><div class="container"><h3>Debug Warning</h3>' +
                             '<p>' + msg + '</p></div></li>';
        window.App.$items.prepend(template);
      },
      removeDebugNotification: function() {
        if($('#debug-notification').length) {
          $('#debug-notification').remove();
        }
      },
  }

  window.Debug = Debug;
  window.App.Stub = Stub;

})();
