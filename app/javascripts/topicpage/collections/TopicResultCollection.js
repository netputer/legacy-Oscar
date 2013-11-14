/*global define*/
'use strict';
(function (window) {
    define([
        'Backbone',
        'main/models/VideoModel'
    ], function (
        Backbone,
        VideoModel
    ) {
        var TopicResultCollection = Backbone.Collection.extend({
            model : VideoModel
        });

        return TopicResultCollection;
    });
}(this));
