/** @jsx React.DOM */
/*global define*/
(function (window, document) {
    define([
        'React',
        'Backbone',
        'IO',
        'searchpage/SearchPageRouter',
        'searchpage/SearchPage'
    ], function (
        React,
        Backbone,
        IO,
        SearchPageRouter,
        SearchPage
    ) {
        React.renderComponent(<SearchPage />, document.body);

        Backbone.history.start();
    });
}(this, this.document));
