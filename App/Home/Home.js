/// <reference path="../App.js" />
/*global app*/

(function () {
  'use strict';
  window.IGC = window.IGC || {};
  window.App = window.App || {};
  
  var interval = null, grabbingSuggestions = false;
  // The initialize function must be run each time a new page is loaded
  Office.initialize = function (reason) {
    $(document).ready(function () {
      app.initialize();
      FileAccessor.init();
      App.Display.initContainers();
      IGC.Api.getStyleguides(App.Display.showStyleguides);

      interval = setInterval(App.getSuggestions, 30000);
    });
  };

  App.getSuggestions = function(){
    if(!grabbingSuggestions) {
      FileAccessor.startProcessing();
      FileAccessor.getText();
    }
  }
  
  App.forceGrabSuggestions = function() {
    if(!grabbingSuggestions) {
      FileAccessor.startProcessing();
      FileAccessor.text = '';
      FileAccessor.getText();
    }
  }

  var FileAccessor = {
    init: function() {
      this.text = '';
      this.currentText = '';
      this.errors = []; 
    },
    getText: function() {
      var self = this;
      Office.context.document.getFileAsync(Office.FileType.Text, {}, self.parseFileResponse);
    },
    parseFileResponse: function(response) {
      if(response.status === 'succeeded') {
        // If the getFileAsync call succeeded, then
        // result.value will return a valid File Object.
        var myFile = response.value;
        var slices = myFile.sliceCount;
        FileAccessor.currentText = '';
        FileAccessor.errors = [];
        // Iterate over the file slices.
        for (var i = 0; i < slices; i++) {
          myFile.getSliceAsync(i, { isLast: (i === slices - 1) }, FileAccessor.parseSliceResponse);
        }
        myFile.closeAsync(); 
      }
      else
        FileAccessor.errors.push(response.error.message);
    },
    parseSliceResponse: function(response) {
      if (response.status == 'succeeded') {
        FileAccessor.currentText += response.value.data;
      }
      else {
        FileAccessor.errors.push(response.error.message);
      } 
      if(!response.asyncContext || response.asyncContext.isLast) {
        FileAccessor.displayFileResponse();
      }
    },
    displayFileResponse: function() {
      grabbingSuggestions = false;
      if(this.errors.length) {
        App.Display.showErrors(this.errors.join(' '));
      }
      else if(this.currentText != this.text) {
        showResults(this.currentText);
        this.text = this.currentText;
      }
    },
  startProcessing: function() {
      App.$items.prepend(App.Display.tipTemplate({ matched_string: 'Loading Matches', explanation: 'Please wait...' }))
    grabbingSuggestions = true;
  }
  }
  
  function showResults(message) {
  App.$items.html('');
    IGC.Api.getTips(message, App.$select.val());
  }

})();