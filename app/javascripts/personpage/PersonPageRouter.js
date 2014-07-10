/*global define*/
(function (window) {
    define(['Backbone'], function (Backbone) {
        var PersonPageRouter = Backbone.Router.extend({
            routes : {
                'detail/:id' : 'detail'
            },
            getQuery : function () {
                return window.location.hash.split('/')[1] || '';
            }
        });

        var personPageRouter;

        return {
            getInstance : function () {
                if (!personPageRouter) {
                    personPageRouter = new PersonPageRouter();
                }

                return personPageRouter;
            }
        };
    });
}(this));
