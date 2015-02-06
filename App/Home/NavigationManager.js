/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define*/
/*global jQuery*/
(function ($) {

    window.App = window.App || {};
    window.debug = window.debug || {};                                                                                 

    var NavigationManager = function () {
        var self = this;
        
        this.$settingsTab = $('[data-settings-tab]');
        this.$resultsTab = $('[data-results-tab]');
        
        this.$settingsCog = $('#settings-trigger');
        this.$settingsCog.on('click', function () {
            self.showSettings();
        });

        this.$homeBtn = $('#trigger-home');
        this.$homeBtn.on('click', function () {
            self.hideSettings();
        });
      
        return self;
    };

    NavigationManager.prototype.showSettings = function () {
        var self = this;
        window.debug.log('showing settings');
        self.$resultsTab.addClass('hidden');

        setTimeout(function () {
            self.$settingsTab.removeClass('hidden');
        }, 100);
    };

    NavigationManager.prototype.hideSettings = function () {
        var self = this;
        window.debug.log('hiding settings');
        self.$settingsTab.addClass('hidden');

        setTimeout(function () {
            self.$resultsTab.removeClass('hidden');
        }, 100);
    };

    window.App.NavigationManager = NavigationManager;
   
}(jQuery));