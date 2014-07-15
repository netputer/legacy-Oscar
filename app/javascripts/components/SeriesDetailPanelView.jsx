/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        '$',
        '_',
        'IO',
        'Actions',
        'Wording',
        'mixins/Performance',
        'utilities/ProviderInfo',
        'utilities/QueryHelper',
        'main/models/VideoModel',
        'mixins/FilterNullValues',
        'components/DescriptionView',
        'components/StillsView',
        'components/DownloadListView',
        'components/PlayListView',
        'components/SeriesHeaderView',
        'components/CommentaryView',
        'components/ExtraInfoView',
        'components/LoadingView',
        'components/DownloadConfirmView'
    ], function (
        React,
        $,
        _,
        IO,
        Actions,
        Wording,
        Performance,
        ProviderInfo,
        QueryHelper,
        VideoModel,
        FilterNullValues,
        DescriptionView,
        StillsView,
        DownloadListView,
        PlayListView,
        SeriesHeaderView,
        CommentaryView,
        ExtraInfoView,
        LoadingView,
        DownloadConfirmView
    ) {

        var cacheId = 0;

        var SeriesDetailPanelView = React.createClass({
            mixins : [Performance],
            getInitialState : function () {
                return {
                    show : false,
                    showConfirm : false,
                    subscribed : -2,
                    showSubscribeBubble : '',
                    loadingEpisodes : false,
                    selectedTab : 'download',
                    origin : this.props.origin,
                    video : new VideoModel(FilterNullValues.filterNullValues.call(FilterNullValues, this.props.origin))
                };
            },
            componentWillReceiveProps : function (newProps) {
                var video = newProps.origin;
                var episodes = [];
                var arrayLength = 0;
                if (newProps.origin.latestEpisodeNum && parseInt(newProps.origin.latestEpisodeNum) <= 10000) {
                    arrayLength = newProps.origin.latestEpisodeNum;
                } else if (newProps.origin.latestEpisodeNum) {
                    arrayLength = 10000;
                }
                var videoArr = new Array(arrayLength);
                episodes = newProps.origin.videoEpisodes;
                videoArr = videoArr.concat.apply(episodes, videoArr);
                videoArr.splice(episodes.length, episodes.length);

                video.videoEpisodes = videoArr;
                var videoModle = new VideoModel(FilterNullValues.filterNullValues.call(FilterNullValues, video));

                this.setState({
                    origin : video,
                    selectedTab : 'download',
                    video : videoModle
                });

                if (videoArr.length > 10) {
                    var max = newProps.origin.videoEpisodes.length > 30 ? 5 : newProps.origin.videoEpisodes.length - 10;

                    QueryHelper.queryEpisodesAsync(newProps.id, 0, max).done(function (resp) {
                        var origin = newProps.origin;
                        var episodes = origin.videoEpisodes;
                        var firstFive = resp.videoEpisodes.reverse();
                        episodes = episodes.concat.apply(episodes, firstFive);
                        episodes.splice(episodes.length - firstFive.length*2, firstFive.length)

                        origin.videoEpisodes = episodes;
                        var videoModle = new VideoModel(FilterNullValues.filterNullValues.call(FilterNullValues, origin));

                        this.setState({
                            origin : origin,
                            video : videoModle
                        });

                    }.bind(this));
                    cacheId = newProps.id;
                }
            },
            componentDidMount : function () {
                $(window).on('resize', _.throttle(function () {
                    $(this.refs.ctn.getDOMNode()).css({
                        height : window.innerHeight
                    });
                }.bind(this), 50));
                ProviderInfo.init();
            },
            clickCtn : function (evt) {
                if (evt.nativeEvent.srcElement.contains(this.refs.ctn.getDOMNode())) {
                    this.props.closeDetailPanel();
                }
            },
            isSubscribed : function (statusCode) {
                this.setState({
                    subscribed : statusCode
                });
            },
            clickTab : function (target) {
                this.setState({
                    selectedTab : target
                });
            },
            getList : function () {
                if (this.state.video.get('type') !== 'MOVIE') {
                    var video = this.state.video;
                    if (this.state.selectedTab === 'download') {
                        return <DownloadListView id={this.props.id} video={video} origin={this.state.origin} subscribed={this.state.subscribed} subscribeHandler={this.isSubscribed} />;
                    } else {
                        return <PlayListView id={this.props.id} video={video} origin={this.state.origin} />;
                    }
                }
            },
            getTabs : function () {
                if (this.state.video.get('type') !== 'MOVIE') {
                    return (
                        <menu className="tab-ctn">
                            <li onClick={this.clickTab.bind(this, 'download')}
                                className={this.state.selectedTab === 'download' ? 'h5 tab selected' : 'h5 tab'}>{Wording.EPISODE_DOWNLOAD}</li>
                            <li onClick={this.clickTab.bind(this, 'play')}
                                className={this.state.selectedTab === 'play' ? 'h5 tab selected' : 'h5 tab'}>{Wording.PLAY}</li>
                        </menu>
                    );
                }
            },
            confirm : function (flag, close) {
                var show = close !== undefined ? false : !!flag;

                if (show && this.state.video.get('videoEpisodes').length > 30) {
                    this.setState({
                        loadingEpisodes : true
                    });

                    QueryHelper.queryEpisodesAsync(this.state.video.id).done(function (resp) {
                        var video = this.state.origin;
                        video.videoEpisodes = resp.videoEpisodes;

                        var videoModle = new VideoModel(FilterNullValues.filterNullValues.call(FilterNullValues, video))

                        this.setState({
                            origin : video,
                            video : videoModle,
                            loadingEpisodes : false,
                            showConfirm : show
                        });
                    }.bind(this));
                } else {
                    this.setState({
                        showConfirm : show
                    });
                }


                if (flag === 1 && close !== undefined && this.state.subscribed !== -2) {
                    this.setState({
                        showSubscribeBubble : 'download_all'
                    });
                }
            },
            render : function () {
                if (!!localStorage.getItem('declaration')) {
                    $('body').toggleClass('overflow', this.state.show);
                }

                var style = {
                    height : window.innerHeight
                };

                var className = this.state.show ? 'o-series-panel show' : 'o-series-panel';

                var video = this.state.video;

                if (video) {
                    if (!this.state.loading) {
                        return (
                            <div className={className} style={style} onClick={this.clickCtn} ref="ctn">
                                <div className="o-series-panel-content w-vbox">
                                    <SeriesHeaderView video={this.state.video} showSubscribeBubble={this.state.showSubscribeBubble} subscribed={this.state.subscribed} subscribeHandler={this.isSubscribed} confirmCallback={this.confirm} loadingEpisodes={this.state.loadingEpisodes} />
                                    <div className="body-ctn">
                                        <div className="body">
                                            {this.getTabs()}
                                            {this.getList()}
                                            <DescriptionView video={video} />
                                            <StillsView video={video} />
                                            <CommentaryView comments={video.get('marketComments')[0].comments} />
                                        </div>
                                        <ExtraInfoView video={video} />
                                    </div>
                                    <div className="o-close" onClick={this.props.closeDetailPanel} />
                                </div>
                                <DownloadConfirmView video={this.state.video} showConfirm={this.state.showConfirm} confirmCallback={this.confirm} />
                            </div>
                        );
                    } else {
                        return (
                            <div className={className}
                                style={style}
                                onClick={this.clickCtn}
                                ref="ctn">
                                <LoadingView />
                            </div>
                        );
                    }
                } else {
                    return (
                        <div className={className}
                            style={style}
                            onClick={this.clickCtn}
                            ref="ctn">
                        </div>
                    );
                }
            }
        });

        return SeriesDetailPanelView;
    });
}(this));
