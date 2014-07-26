(function (window) {
    define([
        'Backbone',
        '_',
        'utilities/FormatString',
        'utilities/FormatDate',
        'utilities/ClientInfo',
        'Wording'
    ], function (
        Backbone,
        _,
        FormatString,
        FormatDate,
        ClientInfo,
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
                providerNames : [],
                episode : {
                    downloadUrls : []
                }
            },
            pretreatData : function () {
                var data = this.toJSON();

                if (!data.actors || !data.actors.length) {
                    data.actors = Wording.NO_DATA;
                } else if (data.actors.length === 1 && data.actors[0].indexOf(',') > 0) {
                    data.actors = data.actors[0].split(',');
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

                if (data.type === 'MOVIE' && data.videoEpisodes) {
                    var episodes = data.videoEpisodes;
                    episodes[0].title = data.title;
                    data.videoEpisodes = episodes;
                }

                if (!data.videoEpisodes) {
                    data.videoEpisodes = [];
                }

                _.each(data.videoEpisodes, function (episode) {
                    var version = ClientInfo.getVersion();
                    var tail = '';

                    if (version < 2.70) {
                        tail = '_' + episode.id;
                    }

                    if (['TV', 'COMIC', 'VARIETY'].indexOf(data.type) >= 0) {
                        if (data.type === 'VARIETY') {
                            episode.title = data.title + '_' + FormatString(Wording.EPISODE_NUM_VARIETY, FormatDate('yyyy-MM-dd', episode.episodeDate)) + tail;
                        } else {
                            episode.title = data.title + '_' + FormatString(Wording.EPISODE_NUM_SHORTEN, episode.episodeNum) + tail;
                        }
                    } else {
                        episode.title = data.title + tail;
                    }
                }, this);

                this.set(data);
            },
            initialize : function () {
                this.pretreatData();
            }
        });

        return VideoModel;
    });
}(this));
