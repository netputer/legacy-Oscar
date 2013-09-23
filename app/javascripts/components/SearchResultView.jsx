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
                var loadingView = this.props.loading ? <LoadingView fixed={true} /> : '';
                if (this.props.list.length > 0) {
                    var listItemViews = _.map(this.props.list, function (video) {
                        return <VideoListItemView video={video} key={video.id} onVideoSelect={this.props.onVideoSelect} />
                    }, this);

                    return (
                        <div class="o-search-result-ctn">
                            <div class="summary h5 w-text-info">共 {this.props.total} 条搜索结果</div>
                            <ul>{listItemViews}</ul>
                            {loadingView}
                        </div>
                    );
                } else {
                    if (this.props.loaded) {
                        return <WanxiaodouView data-tip={this.props.keyword} data-type="NO_SEARCH_RESULT" />;
                    } else {
                        return <div class="o-search-result-ctn" />;
                    }
                }
            }
        });

        return SearchResultView;
    });
}(this));
