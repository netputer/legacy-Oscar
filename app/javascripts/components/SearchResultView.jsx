/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        '$',
        'Backbone',
        'components/WanxiaodouView',
        'components/VideoListItemView',
        'components/LoadingView'
    ], function (
        React,
        _,
        $,
        Backbone,
        WanxiaodouView,
        VideoListItemView,
        LoadingView
    ) {

        var FilterView = React.createClass({
            render : function () {
            }
        });

        var SearchResultView = React.createClass({
            render : function () {
                if (this.props.loading) {
                    return <LoadingView />;
                } else {
                    if (this.props.list.length > 0) {
                        var listItemViews = _.map(this.props.list, function (video) {
                            return <VideoListItemView data-model={video} key={video.id} />
                        });

                        return (
                            <div>
                                <div>共 {this.props.total} 条搜索结果</div>
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
