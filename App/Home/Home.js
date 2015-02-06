/// <reference path="../App.js" />
/*global app*/

(function () {
    'use strict';

    window.App = window.App || {};
    window.IGC = window.IGC || {};
    window.App.baseUrl = 'http://irregardless.ly/';
    window.debug = {
        log: function (msg) {
            console.log(msg);
            //$('.debug-message').append(msg + '<br />');
        }
    };

    var autorunManager,
        styleguideManager,
        navigationManager,
        feedbackManager,
        $tooltip,
        initializeElements = function () {
            styleguideManager = new window.App.StyleguideManager();
            navigationManager = new window.App.NavigationManager();
            feedbackManager = new window.App.FeedbackManager(styleguideManager);
            autorunManager = new window.App.AutorunManager(feedbackManager);

            $tooltip = $('[data-tool-tip]');
            $tooltip.tipr();
        },
        ready = function () {
            initializeElements();
            window.IGC.Api.getStyleguides(function(resp) {
                styleguideManager.renderStyleguides(resp);
            });
        };
    
    // The initialize function must be run each time a new page is loaded
    if (window.Office) {
        Office.initialize = function (reason) {
            $(document).ready(function () {
                window.debug.log('Office.initialize called');
                ready();
            });
        }
    } else {
        $(document).ready(function () {
            window.debug.log('Office does not exist');
            ready();
        });
    }

})();