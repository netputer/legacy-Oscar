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
            render : function () {

                var data = this.props.data;
                var rating = data.marketRatings;
                var actors = data.actors;
                var type = data.type;
                var title = data.title;
                var region = data.region || '';
                var categories = data.categories;
                var providerNames = data.providerNames;
                var year = data.year;

                if (actors.length) {
                    actors = actors.join(' / ');
                } else {
                    actors = textEnum.NO_DATA;
                }

                if (rating && rating.length) {
                    rating = rating[0].rating;
                } else {
                    rating = textEnum.NO_RATING;
                }

                if (categories && categories.length) {
                    categories = _.pluck(categories, 'name').join(' / ');
                } else {
                    categories = textEnum.NO_DATA;
                }

                if (providerNames && providerNames.length) {
                    providerNames = providerNames.join(' / ');
                } else {
                    providerNames = '';
                }

                switch (data.type) {
                case "MOVIE":

                    return (
                        React.DOM.div( {className:"o-info-container"}, 
                            React.DOM.h3( {className:"title"}, title),
                            React.DOM.span( {className:"actors w-text-info wc"}, FormatString(textEnum.ACTORS, [actors])),
                            React.DOM.span( {className:"categories w-text-info"}, categories + (region && ' / ' + region) + (year && ' / ' + year + '年')),React.DOM.br(null),
                            React.DOM.span( {className:"w-text-info", dangerouslySetInnerHTML:{ __html : FormatString(textEnum.RATING, [rating]) }}),React.DOM.br(null),
                            React.DOM.button( {className:"download w-btn w-btn-primary", onClick:this.download}, textEnum.DOWNLOAD),
                            React.DOM.span( {className:"provider"}, FormatString(textEnum.PROVIDER, [providerNames]))
                        )
                    );
                case "TV":
                case "COMIC":

                    return (
                        React.DOM.div( {className:"o-info-container"}, 
                            React.DOM.h3( {className:"title"}, title),
                            React.DOM.span( {className:"actors w-text-info wc"}, FormatString(textEnum.ACTORS, [actors])),
                            React.DOM.span( {className:"categories w-text-info"}, categories + (region && ' / ' + region) + (year && ' / ' + year + '年')),React.DOM.br(null),
                            React.DOM.span( {className:"w-text-info", dangerouslySetInnerHTML:{ __html : FormatString(textEnum.RATING, [rating]) }}),React.DOM.br(null),
                            React.DOM.button( {className:"download w-btn w-btn-primary", onClick:this.download}, textEnum.DOWNLOAD_ALL),
                            React.DOM.span( {className:"provider"}, FormatString(textEnum.PROVIDER, [providerNames]))
                        )
                    );
                    break;
                case "VARIETY":

                    var presenters = data.presenters;
                    if (presenters.length) {
                        presenters = presenters.join(' / ');
                    } else {
                        presenters = textEnum.NO_DATA;
                    }

                    return (
                        React.DOM.div( {className:"o-info-container"}, 
                            React.DOM.h3( {className:"title"}, title),
                            React.DOM.span( {className:"presenters w-text-info wc"}, FormatString(textEnum.PRESENTER, [presenters])),
                            React.DOM.span( {className:"categories w-text-info"}, categories + (region && ' / ' + region) + (year && ' / ' + year + '年')),React.DOM.br(null),
                            React.DOM.span( {className:"w-text-info", dangerouslySetInnerHTML:{ __html : FormatString(textEnum.RATING, [rating]) }}),React.DOM.br(null),
                            React.DOM.button( {className:"download w-btn w-btn-primary", onClick:this.download}, textEnum.DOWNLOAD),
                            React.DOM.span( {className:"provider"}, FormatString(textEnum.PROVIDER, [providerNames]))
                        )
                    );
                    break;
                }
            },
            download: function () {

            }
        });

        var PictureView = React.createClass({displayName: 'PictureView',
            getInitialState : function () {
                return {
                    className : ''
                };
            },
            render : function () {
                return (
                    React.DOM.div( {className:"o-picture-container"}, 
                        React.DOM.ul( {className:"o-picture-item-container"}, 
                        this.renderItems()
                        )
                    )
                );
            },
            renderItems : function () {
                var pictures = this.props.data;
                var len = pictures.length > 4 ? 4 : pictures.length;
                var result = [];

                for (var i = 0; i < len; i++) {
                    result.push(
                        React.DOM.li( {className:"o-picture-item"}, 
                            React.DOM.img( {ref:'item' + i, src:pictures[i], className:this.state.className})
                        )
                    );
                }

                return result;
            },
            componentDidMount : function () {
                _.map(this.refs, function (item) {
                    var node = item.getDOMNode();
                    node.onload = function () {
                        var width = this.width;
                        var height = this.height;

                        if (width >= height) {
                            this.className = 'horizontal';
                        } else {
                            this.className = 'vertical';
                        }
                    }
                });
            }
        });

        var BannerView = React.createClass({displayName: 'BannerView',
            render : function () {

                var data = this.props.data;

                return (
                    React.DOM.div( {className:"o-banner-container"}, 
                        React.DOM.div( {className:"o-cover"}, 
                            React.DOM.img( {src:data.cover.l})
                        ),
                        InfoView( {data:data}),
                        PictureView( {data:data.pictures.s})
                    )
                );
            }
        });

        return BannerView;
    });
}(this));
