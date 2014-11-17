/// <reference path="../App.js" />
/*global app*/

(function () {
  'use strict';
  window.IGC = window.IGC || {};
    window.App = window.App || {};
  var interval = null;
  // The initialize function must be run each time a new page is loaded
  Office.initialize = function (reason) {
    $(document).ready(function () {
      app.initialize();
      FileAccessor.init();
      App.Display.initContainers();
            IGC.Api.getStyleguides(App.Display.showStyleguides);

      interval = setInterval(App.getSuggestions, 10000);
    });
  };

  App.getSuggestions = function(){
  FileAccessor.getText();
  }
  
  App.forceGrabSuggestions = function() {
  FileAccessor.text = '';
  FileAccessor.getText();
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
      if (response.status == "succeeded") {
        // If the getFileAsync call succeeded, then
        // result.value will return a valid File Object.
         var myFile = response.value;
         var slices = myFile.sliceCount;
     FileAccessor.currentText = '';
     FileAccessor.errors = [];
     // Iterate over the file slices.
     for (var i = 0; i < slices; i++) {
           myFile.getSliceAsync(i, FileAccessor.parseSliceResponse);
         }
         myFile.closeAsync(); 
       }
       else
         FileAccessor.errors.push(response.error.message);
  },
  parseSliceResponse: function(response, last) {
      if (response.status == "succeeded") {
        FileAccessor.currentText += response.value.data;
    } else {
        FileAccessor.errors.push(response.error.message);
    } 
    if(true) {
    FileAccessor.displayFileResponse();
    }
  },
  displayFileResponse: function() {
      if(this.errors.length) {
    App.Display.showErrors(this.errors.join(' '));
      }
    else if(this.currentText != this.text) {
        showResults(this.currentText);
    this.text = this.currentText;
      }
  }
  }
  
  function showResults(message) {
    IGC.Api.getTips(message, App.$select.val());
  }

})();