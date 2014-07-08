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

        var queryEpisodesAsync = function (id) {
            var deferred = $.Deferred();

            IO.requestAsync({
                url : Actions.actions.QUERY_SERIES + id,
                data : {
                    opt_fields : 'videoEpisodes.*'
                },
                success : deferred.resolve,
                error : deferred.reject
            });

            return deferred.promise();
        };


        var SeriesDetailPanelView = React.createClass({
            mixins : [Performance],
            getInitialState : function () {
                return {
                    show : false,
                    showConfirm : false,
                    subscribed : -2,
                    showSubscribeBubble : '',
                    selectedTab : 'download',
                    video : {}
                };
            },
            componentWillReceiveProps : function (newProps) {
                if (newProps.video !== undefined) {
                    this.setState({
                        video : newProps.video
                    });

                    if (newProps.type !== 'MOVIE') {
                        this.setState({
                            selectedTab : 'download'
                        });
                    }
                }

                if (newProps.id && cacheId !== newProps.id) {
                    queryEpisodesAsync(newProps.id).done(function (resp) {
                        var video = this.props.origin;
                        video.videoEpisodes = resp.videoEpisodes;
                        var videoModle = new VideoModel(FilterNullValues.filterNullValues.call(FilterNullValues, video));

                        this.setState({
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
                var video = this.state.video;
                if (this.state.selectedTab === 'download') {
                    return <DownloadListView subscribed={this.state.subscribed} video={video} subscribeHandler={this.isSubscribed} />;
                } else {
                    return <PlayListView video={video} />;
                }
            },
            getTabs : function () {
                return (
                    <menu className="tab-ctn">
                        <li onClick={this.clickTab.bind(this, 'download')}
                            className={this.state.selectedTab === 'download' ? 'h5 tab selected' : 'h5 tab'}>{Wording.EPISODE_DOWNLOAD}</li>
                        <li onClick={this.clickTab.bind(this, 'play')}
                            className={this.state.selectedTab === 'play' ? 'h5 tab selected' : 'h5 tab'}>{Wording.PLAY}</li>
                    </menu>
                );
            },
            confirm : function (flag, close) {
                var show = close !== undefined ? false : !!flag;
                this.setState({
                    showConfirm : show
                });

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

                var video = this.props.video;

                if (video) {
                    if (!this.state.loading) {
                        return (
                            <div className={className} style={style} onClick={this.clickCtn} ref="ctn">
                                <div className="o-series-panel-content w-vbox">
                                    <SeriesHeaderView video={this.state.video} showSubscribeBubble={this.state.showSubscribeBubble} subscribed={this.state.subscribed} subscribeHandler={this.isSubscribed} confirmCallback={this.confirm} />
                                    <div className="body-ctn">
                                        <div className="body">
                                            {this.props.video.get('type') === 'MOVIE' ? '' : this.getTabs()}
                                            {this.props.video.get('type') === 'MOVIE' ? '' : this.getList()}
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
