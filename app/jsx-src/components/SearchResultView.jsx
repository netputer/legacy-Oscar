/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        '$',
        'Backbone',
        'components/WanxiaodouView',
        'components/ViewListItemView'
    ], function (
        React,
        _,
        $,
        Backbone,
        WanxiaodouView,
        ViewListItemView
    ) {

        var VideoModel = Backbone.Model.extend({
            defaults : {
                pictures : {
                    l : [],
                    s : []
                }
            }
        });

        var SearchResultView = React.createClass({
            render : function () {
                if (this.props.loading) {
                    return <div>loading...</div>
                } else {
                    if (this.props.list.length > 0) {
                        var listItemViews = _.map(this.props.list, function (video) {
                            return <ViewListItemView data-model={new VideoModel(video)} key={video.id} />
                        });

                        return (
                            <div>
                                <ul>{listItemViews}</ul>
                            </div>
                        );
                    } else {
                        return <WanxiaodouView data-tip={this.props.keyword} data-type="NO_SEARCH_RESULT" />;
                    }

                }
            }
        });

        return SearchResultView;
    });
}(this));
