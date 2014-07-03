/*global define*/
(function (window) {
    define(['Backbone'], function (Backbone) {
        var SearchPageRouter = Backbone.Router.extend({
            routes : {
                'q/:key' : 'compate',
                'detail/:id' : 'search'
            },
            getQuery : function () {
                return window.location.hash.split('/')[1] || '';
            }
        });

        var searchPageRouter;

        return {
            getInstance : function () {
                if (!searchPageRouter) {
                    searchPageRouter = new SearchPageRouter();
                }

                return searchPageRouter;
            }
        };
    });
}(this));
