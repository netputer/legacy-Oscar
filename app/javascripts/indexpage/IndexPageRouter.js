/*global define*/
(function (window) {
    define(['Backbone'], function (Backbone) {
        var IndexPageRouter = Backbone.Router.extend({
            routes : {
                'detail/:query' : 'detail',
                '*path' : 'index'
            }
        });

        return IndexPageRouter;
    });
}(this));
