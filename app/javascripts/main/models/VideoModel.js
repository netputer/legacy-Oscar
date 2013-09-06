(function (window) {
    define([
        'Backbone',
        '_'
    ], function (
        Backbone,
        _
    ) {
        var TEXT_ENUM = {
            NO_DATA : '暂无数据',
            NO_RATING : '暂无评分'
        };

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
                }]]
            },
            pretreatData : function () {
                var data = this.toJSON();

                if (data.actors.length) {
                    data.actors = data.actors.join(' / ');
                } else {
                    data.actors = TEXT_ENUM.NO_DATA;
                }

                if (data.marketRatings && data.marketRatings.length) {
                    data.rating = data.marketRatings[0].rating;
                } else {
                    data.rating = TEXT_ENUM.NO_RATING;
                }

                if (data.categories && data.categories.length) {
                    data.categories = _.pluck(data.categories, 'name').join(' / ');
                } else {
                    data.categories = TEXT_ENUM.NO_DATA;
                }

                if (data.providerNames && data.providerNames.length) {
                    data.providerNames = data.providerNames.join(' / ');
                } else {
                    data.providerNames = '';
                }

                if (data.presenters && data.presenters.length) {
                    data.presenters = data.presenters.join(' / ');
                } else {
                    data.presenters = TEXT_ENUM.NO_DATA;
                }

                data.description = data.description.trim();

                this.set(data);
                console.log(this.toJSON());
            },
            initialize : function () {
                this.pretreatData();
            }
        });

        return VideoModel;
    });
}(this));
