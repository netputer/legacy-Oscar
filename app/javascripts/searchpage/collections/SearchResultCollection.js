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
        var SearchResultCollection = Backbone.Collection.extend({
            model : VideoModel
        });

        return SearchResultCollection;
    });
}(this));
