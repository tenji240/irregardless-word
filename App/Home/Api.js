//
// exports window.IGC.Api
//
(function($){

  window.IGC = window.IGC || {};
  window.App = window.App || {};

  var HOST = "https://api.irregardless.ly/api/v1",
      API_KEY = "5bqrrwh7a65cqh28ch9fn6aj",
      MATCH_ENDPOINT = HOST + "/rules/match?api_key=" + API_KEY,
      GUIDES_ENDPOINT = HOST + "/style_guides?api_key=" + API_KEY;

  var Api = {
    getStyleguides: function(success){
      $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: GUIDES_ENDPOINT,
        dataType: 'json',
        success: function(resp){
          success(resp);
        }
      });
    },
    getTips: function(text, collectionId){
      if(!text.length || !collectionId || collectionId === 0) return;
      
      var data = { body: text };
      
      if(collectionId){
        data.style_guide_id = collectionId;
      }

      $.ajax({
        contentType: 'application/json',
        data: JSON.stringify(data),
        dataType: 'json',
        type: 'POST',
        url: MATCH_ENDPOINT,
        success: function(resp, status, evt){
      console.log(resp);
          App.Display.showTips(resp);
          return resp;
        },
        error: function(resp){
      App.Display.showErrors(resp);
          return resp;
        },
        complete: function(){
          console.log('response complete');
        }
      });
    }
  };

  IGC.Api = Api;

})(jQuery);