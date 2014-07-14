/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        '$',
        'Wording',
        'Backbone',
        'components/WanxiaodouView',
        'components/VideoListItemView',
        'components/LoadingView'
    ], function (
        React,
        _,
        $,
        Wording,
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
                    var listItemViews = _.map(this.props.list, function (video, index) {
                        return <VideoListItemView source="search" video={video} origin={this.props.origin[index]} key={video.id} onVideoSelect={this.props.onVideoSelect} />
                    }, this);

                    return (
                        <div className="o-search-result-ctn">
                            <h4 className="search-title w-text-secondary">{Wording.VIDEO}</h4>

                            <ul>{listItemViews}</ul>
                            {loadingView}
                        </div>
                    );
                } else {
                    if (this.props.loaded) {
                        return <WanxiaodouView data-tip={this.props.keyword} data-type="NO_SEARCH_RESULT" />;
                    } else {
                        return <div className="o-search-result-ctn" />;
                    }
                }
            }
        });

        return SearchResultView;
    });
}(this));
