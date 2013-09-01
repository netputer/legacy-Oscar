/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        '$',
        'Backbone',
        'components/WanxiaodouView',
        'components/VideoListItemView'
    ], function (
        React,
        _,
        $,
        Backbone,
        WanxiaodouView,
        VideoListItemView
    ) {

        var VideoModel = Backbone.Model.extend({
            defaults : {
                pictures : {
                    l : [],
                    s : []
                }
            }
        });

        var SearchResultView = React.createClass({displayName: 'SearchResultView',
            render : function () {
                if (this.props.loading) {
                    return React.DOM.div(null, "loading...")
                } else {
                    if (this.props.list.length > 0) {
                        var listItemViews = _.map(this.props.list, function (video) {
                            return VideoListItemView( {'data-model':new VideoModel(video), key:video.id} )
                        });

                        return (
                            React.DOM.div(null, 
                                React.DOM.ul(null, listItemViews)
                            )
                        );
                    } else {
                        return WanxiaodouView( {'data-tip':this.props.keyword, 'data-type':"NO_SEARCH_RESULT"} );
                    }

                }
            }
        });

        return SearchResultView;
    });
}(this));
