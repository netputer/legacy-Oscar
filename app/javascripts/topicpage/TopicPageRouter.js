/*global define*/
(function (window) {
    define(['Backbone'], function (Backbone) {
        var TopicPageRouter = Backbone.Router.extend({
            routes : {
                'detail/:id' : 'topic'
            }
        });

        var topicPageRouter;

        return {
            getInstance : function () {
                if (!topicPageRouter) {
                    topicPageRouter = new TopicPageRouter();
                }

                return topicPageRouter;
            }
        };
    });
}(this));
