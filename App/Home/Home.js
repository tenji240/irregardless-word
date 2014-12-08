/// <reference path="../App.js" />
/*global app*/

(function () {
  'use strict';
  window.IGC = window.IGC || {};
  window.App = window.App || {};
  window.Debug = window.Debug || {};
  window.App.baseUrl = 'http://irregardless.ly/';

  var interval = null, grabbingSuggestions = false;
  // The initialize function must be run each time a new page is loaded
  var ready = function(reason) {
    $(document).ready(function () {

      app.initialize();
      FileAccessor.init();
      window.App.Display.initContainers(); 
      window.IGC.Api.getStyleguides(window.App.Display.showStyleguides);

      interval = setInterval(window.App.getSuggestions, 10000);
      Debug.showMessage('Properly initialized application');
    });
  }

  Office.initialize = function (reason) {
    ready(reason);
  };

  window.App.getSuggestions = function(){
    if(Debug.debugging) {
      window.App.Stub.forceGrabSuggestions();
    } else if(!grabbingSuggestions) {
      FileAccessor.startProcessing();
      FileAccessor.getText();
    }
  }
  
  window.App.forceGrabSuggestions = function() {
    if(Debug.debugging) {
      window.App.Stub.forceGrabSuggestions();
    } else if(!grabbingSuggestions) {
      FileAccessor.startProcessing();
      FileAccessor.text = '';
      FileAccessor.getText();
    }
  }

  window.App.setStyleguideState = function(value) {
    if(Debug.debugging) {
      Debug.showMessage('Setting styleguide state to: ' + value);
    } else {
      Office.context.document.settings.set('styleguide', value);
      Office.context.document.settings.saveAsync(function(asyncResult) {
        console.log(asyncResult);
      });
    }
  }

  window.App.getStyleguideState = function() {
    var defaultStyleguide = 0;
    if(Debug.debugging) {
      Debug.showMessage('Got styleguide state: ' + defaultStyleguide);
      return defaultStyleguide;
    } else {
      return Office.context.document.settings.get('styleguide') || defaultStyleguide;
    }
  }

  var FileAccessor = {
    init: function() {
      this.text = '';
      this.currentText = '';
      this.errors = []; 
    },
    getText: function() {
      if(Debug.debugging) return '';
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
      if (response.status === 'succeeded') {
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
      window.App.Display.hideLoadingNotification();
      if(this.errors.length) {
        window.App.Display.showErrors(this.errors.join(' '));
      }
      else if(this.currentText != this.text) {
        showResults(this.currentText);
        this.text = this.currentText;
      }
    },
    startProcessing: function() {
      //window.App.Display.showLoadingNotification();
      
      grabbingSuggestions = true;
    }
  }
  
  var showResults = function(message) {
    window.App.$items.html('');
    window.IGC.Api.getTips(message, window.App.$select.val());
  }

  ready();

})();