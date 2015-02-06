/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define*/
/*global jQuery*/
(function ($) {

    window.App = window.App || {};
    window.debug = window.debug || {};                                                                                 

    var AutorunManager = function (feedbackManager) {
        var self = this;
        
        this.feedbackManager = feedbackManager;
        this.intervalRate = 30000;
        this.feedbackInterval = null;
        
        this.$autoRun = $('#toggle-autorun');
        this.$autoRun.prop('checked', localStorage.autoRun === "true");
        this.$autoRun.on('change', function () {
            localStorage.autoRun = localStorage.autoRun !== "true";
            self.toggleAutoRun();
        });

        this.$tipTrigger = $('#refresh-suggestions');
        this.$tipTrigger.on('click', function () {
            if (!self.feedbackManager.isWorking()) {
                self.feedbackManager.getFeedback();
            }
        });

        self.toggleAutoRun();

        return self;
    };

    AutorunManager.prototype.toggleAutoRun = function() {
        var self = this;

        if (localStorage.autoRun === 'true') {
            self.feedbackInterval = setInterval(function () {
                self.feedbackManager.getFeedback();
            }, self.intervalRate);
        } else if (self.feedbackInterval) {
            clearInterval(self.feedbackInterval);
        }
    }

    window.App.AutorunManager = AutorunManager;
   
}(jQuery));