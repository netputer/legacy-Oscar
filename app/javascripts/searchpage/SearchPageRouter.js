/*global define*/
(function (window) {
    define(['Backbone'], function (Backbone) {
        var SearchPageRouter = Backbone.Router.extend({
            routes : {
                'q/:query' : 'search'
            },
            getQuery : function () {
                return location.hash.split('/')[1] || '';
            }
        });

        return SearchPageRouter;
    });
}(this));
