/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define*/
/*global jQuery*/
(function ($) {

    window.App = window.App || {};
    window.debug = window.debug || {};

    var throttle = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    }());

    var StyleguideManager = function () {
        window.debug.log('initializing styleguide manager');
        
        var self = this;
        this.$select = $('#styleguide-select');
        this.$gotoGuide = $('#goto-styleguide');
        this.$query = $('#styleguide-query-input');
        this.cachedStyleguides = [];
        this.route = 'style_guides/';
        
        self.setStyleguide(localStorage.styleguideId || 0);
        window.debug.log('linked all the elements');

        this.$select.on('click', 'li', function () {
            window.debug.log('select item hype');
            var value = $(this).data('save-guide-id');
            window.debug.log('value hype: ' + value);
            self.setStyleguide(value);
            self.renderStyleguides();
        });

        window.debug.log('initialized select on click');
        this.$query.on('keyup', function () {
            throttle(function () {
                window.debug.log('query throttled: ' + self.$query.val());
                window.IGC.Api.getStyleguides(function(resp) {
                    self.renderStyleguides(resp)
                }, self.$query.val());
            }, 1000);
        });
        window.debug.log('finished initialization');
        return self;
    };

    StyleguideManager.prototype.template = function (styleguide) {
        var classes = '',
            check = '';

        if (parseInt(styleguide.id, 10) === parseInt(this.selectedStyleGuide, 10)) {
            window.debug.log('selected guide: ' + styleguide.name);
            classes += 'chosen-guide';
            check = '<span class="check">&#x2713;</span>'
        }

        return '<li class="' + classes + '" data-save-guide-name="' + styleguide.name +
            '" data-save-guide-id=' + styleguide.id + '>' +
            styleguide.name + check +
            "</li>";
    };

    StyleguideManager.prototype.renderStyleguides = function (styleguides) {
        window.debug.log('rendering styleguides');
        var self = this,
                i,
                styleguide;
    
        if (styleguides) {
            self.cachedStyleguides = styleguides;
        }
    
        this.$select.html('');

        for (i in self.cachedStyleguides) {
            styleguide = self.template(self.cachedStyleguides[i]);
            self.$select.append(styleguide);
        }
    };

    StyleguideManager.prototype.setStyleguide = function(styleguideId) {
        this.selectedStyleGuide = styleguideId;
        localStorage.styleguideId =  styleguideId;

        window.debug.log('selected guide is: ' + styleguideId);
        if (this.validGuide(styleguideId)) {
            this.$gotoGuide.removeClass('hidden');
        } else {
            this.$gotoGuide.addClass('hidden');
        }
        window.debug.log('toggled class on $gotoGuide');

        this.$gotoGuide.attr('href', this.styleguideRoute(styleguideId));
    };

    StyleguideManager.prototype.styleguideRoute = function(styleguideId) {
        window.debug.log('getting route for: ' + styleguideId);
        if (!this.validGuide(styleguideId)) {
            return '#';
        }
        window.debug.log('valid styleguide: ' + styleguideId);
        return window.App.baseUrl + this.route + styleguideId;
    };

    StyleguideManager.prototype.validGuide = function (styleguideId) {
        return parseInt(styleguideId, 10) !== 0;
    };

    window.App.StyleguideManager = StyleguideManager;
   
}(jQuery));