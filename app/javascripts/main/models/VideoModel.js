(function (window) {
    define([
        'Backbone',
        '_',
        'Wording'
    ], function (
        Backbone,
        _,
        Wording
    ) {

        var VideoModel = Backbone.Model.extend({
            defaults : {
                pictures : {
                    l : [],
                    s : []
                },
                cover : {
                    l : []
                },
                marketComments : [[{
                    comments : []
                }]],
                providerNames : []
            },
            pretreatData : function () {
                var data = this.toJSON();

                if (data.actors.length) {
                    data.actors = data.actors.join(' / ');
                } else {
                    data.actors = Wording.NO_DATA;
                }

                if (data.marketRatings && data.marketRatings.length) {
                    data.rating = data.marketRatings[0].rating;
                } else {
                    data.rating = Wording.NO_RATING;
                }

                if (data.categories && data.categories.length) {
                    data.categories = _.pluck(data.categories, 'name').join(' / ');
                } else {
                    data.categories = Wording.NO_DATA;
                }

                if (data.presenters && data.presenters.length) {
                    data.presenters = data.presenters.join(' / ');
                } else {
                    data.presenters = Wording.NO_DATA;
                }

                if (data.description) {
                    data.description = data.description.trim();
                }

                if (data.type === 'MOVIE') {
                    var episodes = data.videoEpisodes;
                    episodes[0].title = data.title;
                    data.videoEpisodes = episodes;
                }

                this.set(data);
            },
            initialize : function () {
                this.pretreatData();
            }
        });

        return VideoModel;
    });
}(this));
