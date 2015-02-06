/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define*/
/*global jQuery*/
(function ($) {
    'use strict';

    window.IGC = window.IGC || {};
    window.App = window.App || {};
    window.debug = window.debug || {};

    var HOST = "https://api.irregardless.ly/api/v1",
        API_KEY = "5bqrrwh7a65cqh28ch9fn6aj",
        MATCH_ENDPOINT = HOST + "/rules/match?api_key=" + API_KEY,
        GUIDES_ENDPOINT = HOST + "/style_guides?api_key=" + API_KEY,
        Api = {
            getStyleguides: function (success, query) {
                var endpoint = query ? (GUIDES_ENDPOINT + '&q=' + query) : GUIDES_ENDPOINT;
                window.debug.log(endpoint);
                $.ajax({
                    type: 'GET',
                    contentType: 'application/json',
                    url: endpoint,
                    dataType: 'json',
                    success: function (resp) {
                        success(resp);
                    },
                    error: function (error) {
                        window.debug.log(error);
                        console.log(error);
                    }
                });
            },
            getTips: function (text, collectionId) {
                if (!text.length || !collectionId || collectionId === 0) return;

                var data = { body: text };
      
                if(collectionId){
                    data.style_guide_id = collectionId;
                }

                return $.ajax({
                    contentType: 'application/json',
                    data: JSON.stringify(data),
                    dataType: 'json',
                    type: 'POST',
                    url: MATCH_ENDPOINT
                });
            }
        };

    window.IGC.Api = Api;

}(jQuery));