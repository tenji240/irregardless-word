/*jslint vars: true, plusplus: true, devel: true, nomen: true, indent: 4, maxerr: 50 */
/*global define*/
/*global jQuery*/
(function ($) {

    window.App = window.App || {};
    window.debug = window.debug || {};

    var FileAccessor = function () {
        var self = this;

        this.fakeFileAccessor = new FakeFileAccessor();
        this.text = '';
        this.currentText = '';
        this.errors = [];
        this.parsingFile = false;

        return self;
    };

    FileAccessor.prototype.getBody = function(callback) {
        this.parsingFile = true;
        var self = this;

        if (!window.Office) {
            self.setBody(self.fakeFileAccessor.getBody(), callback);
        } else {
            Office.context.document.getFileAsync(Office.FileType.Text, {}, function(response) {
                self.parseFileResponse(response, callback);
            });
        }
    };

    FileAccessor.prototype.setBody = function (body, callback) {
        window.debug.log('body being set: ' + body);
        this.text = body;
        this.currentText = body;
        callback(body);
        this.parsingFile = false;
    }

    FileAccessor.prototype.parseFileResponse = function (response, callback) {
        var self = this,
            i,
            myFile,
            slices;

        if (response.status === 'succeeded') {
            // If the getFileAsync call succeeded, then
            // result.value will return a valid File Object.
            myFile = response.value;
            slices = myFile.sliceCount;
            self.currentText = '';
            self.errors = [];
            // Iterate over the file slices.
            for (i = 0; i < slices; i++) {
                myFile.getSliceAsync(i, {
                    isLast: (i === slices - 1)
                }, function(response) {
                    self.parseSliceResponse(response, callback);
                });
            }
            myFile.closeAsync();
        } else {
            FileAccessor.errors.push(response.error.message);
            callback('');
        }
    };

    FileAccessor.prototype.parseSliceResponse = function (response, callback) {
        var self = this;

        if (response.status === 'succeeded') {
            self.currentText += response.value.data;
        } else {
            self.errors.push(response.error.message);
        }
        if (!response.asyncContext || response.asyncContext.isLast) {
            self.setBody(self.currentText, callback);
        }
    };

    var FakeFileAccessor = function () {
        this.files = ['We should sit down with a googler about this trivial issue.', '',
            'This is a relatively normal sentence which requires no suggestions',
            'This is some very unique text, which should trigger a few errors',
            'These types of phrases often tend to join together, obviously to create the most laconic runon you have ever seen',
            'We should really get at the epicenter of the problem and interface with our customers, I hope I do not have to reiterate again'
        ]
        return this;
    }

    FakeFileAccessor.prototype.getBody = function () {
        var self = this,
            index = parseInt(Math.random() * self.files.length, 10);

        return self.files[index];
    }

    window.App.FileAccessor = FileAccessor;

}(jQuery));