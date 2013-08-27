/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        'Backbone',
        'utilities/FormatString'
    ], function (
        React,
        _,
        Backbone,
        FormatString
    ) {

        var textEnum = {
            LAST_EPISODE : '第{0}集',
            TOTLE_COMPLATE : '{0}集完',
            NO_RATING : '暂无评分',
            NO_DATA : '暂无数据',
            ACTORS : '主演：{0}',
            RATING : '评分：<span class="rating">{0}</span>',
            DOWNLOAD_ALL : '下载全部',
            DOWNLOAD : '下载',
            PROVIDER : '来源：{0}',
            PRESENTER : '主持人：{0}'
        };

        var InfoView = React.createClass({displayName: 'InfoView',
            pretreatData : function (data) {
                if (data.actors.length) {
                    data.actors = data.actors.join(' / ');
                } else {
                    data.actors = textEnum.NO_DATA;
                }

                if (data.marketRatings && data.marketRatings.length) {
                    data.rating = data.marketRatings[0].rating;
                } else {
                    data.rating = textEnum.NO_RATING;
                }

                if (data.categories && data.categories.length) {
                    data.categories = _.pluck(data.categories, 'name').join(' / ');
                } else {
                    data.categories = textEnum.NO_DATA;
                }

                if (data.providerNames && data.providerNames.length) {
                    data.providerNames = data.providerNames.join(' / ');
                } else {
                    data.providerNames = '';
                }

                if (data.presenters && data.presenters.length) {
                    data.presenters = data.presenters.join(' / ');
                } else {
                    data.presenters = textEnum.NO_DATA;
                }

                return data;
            },
            getDownloadEle : function (data) {
                switch (data.type) {
                case 'MOVIE':
                case 'TV':
                case 'VARIETY':
                    return React.DOM.button( {className:"download w-btn w-btn-primary", onClick:this.download}, textEnum.DOWNLOAD);
                    break;
                case 'COMIC':
                    return React.DOM.button( {className:"download w-btn w-btn-primary", onClick:this.download}, textEnum.DOWNLOAD_ALL);
                    break;
                }
            },
            getPresenters : function (data) {
                var result = '';
                if (data.type === 'VARIETY') {
                    result = FormatString(textEnum.PRESENTER, [data.presenters])
                } else {
                    result = FormatString(textEnum.ACTORS, [data.actors]);
                }

                return result;
            },
            render : function () {
                var data = this.pretreatData(this.props.data);
                var rating = data.rating;
                var title = data.title;
                var region = data.region || '';
                var categories = data.categories;
                var providerNames = data.providerNames;
                var year = data.year;

                return (
                    React.DOM.div( {className:"info-container"}, 
                        React.DOM.h3( {className:"title", dangerouslySetInnerHTML:{ __html : title }}),
                        React.DOM.div( {className:"actors w-text-info w-wc"}, this.getPresenters(data)),
                        React.DOM.div( {className:"categories w-text-info w-wc"}, categories + (region && ' / ' + region) + (year && ' / ' + year + '年')),
                        React.DOM.div( {className:"w-text-info w-wc", dangerouslySetInnerHTML:{ __html : FormatString(textEnum.RATING, [rating]) }}),
                        React.DOM.div( {className:"download-ctn"}, 
                            this.getDownloadEle(data),
                            React.DOM.span( {className:"provider w-wc"}, FormatString(textEnum.PROVIDER, [providerNames]))
                        )
                    )
                );
            },
            download: function () {

            }
        });

        var PictureView = React.createClass({displayName: 'PictureView',
            render : function () {
                return (
                    React.DOM.ul( {className:"thumb-container w-hbox"}, 
                    this.renderItems()
                    )
                );
            },
            renderItems : function () {
                var pictures = this.props.data;
                var len = pictures.length > 4 ? 4 : pictures.length;
                var result = [];
                var i;

                for (i = 0; i < len; i++) {
                    result.push(
                        React.DOM.li(
                            {className:"thumb-item",
                            style:{ 'background-image' : 'url(' + pictures[i] + ')' },
                            key:pictures[i]} )
                    );
                }

                return result;
            }
        });

        var VideoListItemView = React.createClass({displayName: 'VideoListItemView',
            render : function () {
                var data = this.props['data-model'].toJSON();

                return (
                    React.DOM.li( {className:"o-list-item w-hbox"}, 
                        React.DOM.div( {className:"item-cover", style:{ 'background-image' : 'url(' + data.cover.l + ')' }} ),
                        InfoView( {data:data} ),
                        PictureView( {data:data.pictures.s} )
                    )
                );
            }
        });

        return VideoListItemView;
    });
}(this));
