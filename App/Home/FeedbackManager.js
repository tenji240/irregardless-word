/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define*/
/*global jQuery*/
(function ($) {

    window.App = window.App || {};
    window.ICG = window.ICG || {};
    window.debug = window.debug || {};                                                                                 

    var FeedbackManager = function (styleguideManager) {
        var self = this;
        
        this.fileAccessor = new window.App.FileAccessor();
        this.styleguideManager = styleguideManager;
        this.$tipList = $('.item-list');

        return self;
    };

    FeedbackManager.prototype.getFeedback = function () {
        var self = this;
        if (self.isWorking()) { return; }
        this.fileAccessor.getBody(function (body) {
            self.checkWriting(body);
        });
    };

    FeedbackManager.prototype.checkWriting = function (body) {
        var self = this,
            styleguide = localStorage.styleguideId;

        window.debug.log('grabbing tips for styleguide: ' + styleguide + ' and message: ' + body);

        if (body.length && self.styleguideManager.validGuide(styleguide)) {
            window.IGC.Api.getTips(body, styleguide)
                  .success(function (resp) {
                        self.displayFeedback(resp);
                    })
                  .error(function (errors) {
                        self.displayMessage('We encountered some issues when trying to check your writing, sorry!');
                        window.debug.log(errors);
                    });
        } else if (!body.length) {
            self.displayMessage('You have to type something in before we can give you any feedback :P');
        } else {
            self.displayMessage('Please select a styleguide from the settings page. To get there click the settings cog');
        }
    };

    FeedbackManager.prototype.displayFeedback = function (tips) {
        var self = this,
            tipIndex;

        self.$tipList.html('');

        for(tipIndex in tips) {
            self.$tipList.append(new App.Tip(tips[tipIndex]).render());
        }

        if(tips.length === 0) {
            self.displayMessage('No results, you have quite the way with words!');
        }
    }

    FeedbackManager.prototype.displayMessage = function (message) {
        this.$tipList.html(App.Tip.debugMessage(message));
    }

    FeedbackManager.prototype.isWorking = function () {
        return this.fileAccessor.parsingFile;
    }

    window.App.FeedbackManager = FeedbackManager;
   
}(jQuery));