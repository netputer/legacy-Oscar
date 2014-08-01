/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        '$',
        '_',
        'IO',
        'GA',
        'Actions',
        'Wording',
        'Actions',
        'mixins/Performance',
        'utilities/ProviderInfo',
        'utilities/QueryHelper',
        'main/models/VideoModel',
        'mixins/FilterNullValues',
        'components/SeriesHeaderView',
        'components/TabView',
        'components/SeriesView',
        'components/DetailView',
        'components/RelatedView',
        'components/SubscribeBubbleView',
        'components/CommentaryView',
        'components/LoadingView',
        'components/DownloadConfirmView'
    ], function (
        React,
        $,
        _,
        IO,
        GA,
        Actions,
        Wording,
        Actions,
        Performance,
        ProviderInfo,
        QueryHelper,
        VideoModel,
        FilterNullValues,
        SeriesHeaderView,
        TabView,
        SeriesView,
        DetailView,
        RelatedView,
        SubscribeBubbleView,
        CommentaryView,
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
                    selectedTab : 'detail',
                    origin : this.props.origin,
                    actors : [],
                    avatars : {},
                    relatedList : [],
                    video : new VideoModel(FilterNullValues.filterNullValues.call(FilterNullValues, this.props.origin))
                };
            },
            componentDidMount : function () {
                $(window).on('resize', _.throttle(function () {
                    $(this.refs.ctn.getDOMNode()).css({
                        height : window.innerHeight
                    });
                }.bind(this), 50));
            },
            componentWillReceiveProps : function (newProps) {
                var video = newProps.origin;
                if (video.id) {
                    Performance.detailOpened(new Date().getTime(), video.id);
                    ProviderInfo.init();
                    var videoModle = new VideoModel(FilterNullValues.filterNullValues.call(FilterNullValues, video));

                    this.setState({
                        selectedTab : video.type !== 'MOVIE' ? 'series' : 'detail',
                        origin : video,
                        video : videoModle
                    });


                    if (video.type === 'MOVIE') {
                        QueryHelper.queryEpisodesAsync(video.id).done(function (resp) {
                            video.videoEpisodes = resp.videoEpisodes;
                            videoModle = new VideoModel(FilterNullValues.filterNullValues.call(FilterNullValues, video));

                            this.setState({
                                origin : video,
                                video : videoModle
                            });
                        }.bind(this));
                    }

                    this.checkSubscription(video.subscribeUrl);


                    if (video.actors && video.actors.length) {
                        QueryHelper.queryPersonAsync(video.actors.join(','), 'name,coverUrl').done(function (resp) {
                            var avatars = [];
                            var actors = [];

                            _.each(resp, function (avatar, index) {
                                avatars[avatar.name] = avatar.coverUrl;
                                actors.push(avatar.name);
                            });

                            this.setState({
                                actors : actors,
                                avatars : avatars
                            });
                        }.bind(this));
                    }

                    QueryHelper.queryRelated(video.id).done(function (resp) {
                        this.setState({
                            relatedList : resp
                        });
                    }.bind(this));



                }
            },
            checkSubscription : function (subscribeUrl) {
                if (subscribeUrl) {
                    $.ajax({
                        url : Actions.actions.SUBSCRIBE_CHECK,
                        xhrFields : {
                            withCredentials : true
                        },
                        data : {
                            uri : subscribeUrl,
                            user : 'device_only'
                        },
                        success : function (data) {
                            if (data === 'true') {
                                this.isSubscribed.call(this, 1);
                            } else {
                                this.isSubscribed.call(this, 0);

                                GA.log({
                                    'event' : 'video.misc.action',
                                    'action' : 'subscribe_button',
                                    'type' : 'display',
                                    'pos' : 'subscribe_button',
                                    'video_id' : this.state.video !== undefined ? this.state.video.id : '',
                                    'video_source' : this.state.video.get('videoEpisodes')[0] && this.state.video.get('videoEpisodes')[0].downloadUrls !== undefined ? this.state.video.get('videoEpisodes')[0].downloadUrls[0].providerName : '',
                                    'video_title' : this.state.video.get('title'),
                                    'video_type' : this.state.video.get('type'),
                                    'video_category' : this.state.video.get('categories'),
                                    'video_year' : this.state.video.get('year'),
                                    'video_area' : this.state.video.get('region')
                                });
                            }
                        }.bind(this),
                        error : function () {
                            this.isSubscribed.call(this);
                        }.bind(this)
                    });
                } else {
                    this.isSubscribed.call(this);
                }
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
            },
            selectTab : function (tab) {
                this.setState({
                    selectedTab : tab
                });
                switch (tab) {
                    case 'series' :
                        $('.body').animate({scrollTop: 0}, '500', 'swing');
                        break;
                    case 'detail' :
                        $('.body').animate({scrollTop: $('.body').scrollTop() + $('.row-detail').position().top}, '500', 'swing');
                        break;
                    case 'related' :
                        $('.body').animate({scrollTop: $('.body').scrollTop() + $('.row-related').position().top}, '500', 'swing');
                        break;
                    case 'comments' :
                        $('.body').animate({scrollTop: $('.body').scrollTop() + $('.row-comments').position().top}, '500', 'swing');
                        break;
                }
            },
            onScroll : function (evt) {
                var tabLength = this.props.origin.type === 'MOVIE' ? 2 : 3;
                if ($('.row-comments').position().top < 50) {
                    $('.h5.tab').removeClass('selected').eq(tabLength).addClass('selected');
                } else if ($('.row-related').position().top < 50) {
                    $('.h5.tab').removeClass('selected').eq(tabLength - 1).addClass('selected');
                } else if ($('.row-detail').position().top < 50) {
                    $('.h5.tab').removeClass('selected').eq(tabLength - 2).addClass('selected');
                } else {
                    $('.h5.tab').removeClass('selected').eq(0).addClass('selected');
                }
            },
            setVideoState : function (data) {
                if (data) {
                    this.setState({
                        video : data
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

                var video = this.props.origin;

                if (video) {
                    if (!this.state.loading) {
                        return (
                            <div className={className} style={style} onClick={this.clickCtn} ref="ctn">

                                <div className="o-series-panel-content w-vbox">
                                    <SeriesHeaderView video={this.state.video} showSubscribeBubble={this.state.showSubscribeBubble} subscribed={this.state.subscribed} confirmCallback={this.confirm} loadingEpisodes={this.state.loadingEpisodes} />
                                    <TabView type={video.type} selectedTab={this.state.selectedTab} selectTab={this.selectTab} />
                                    <div className="body" onScroll={this.onScroll}>
                                        <SeriesView videoCallback={this.setVideoState} origin={video} video={this.state.video} id={video.id} source={this.props.source} isSubscribed={this.isSubscribed} subscribed={this.state.subscribed} subscribeHandler={this.isSubscribed} />
                                        <DetailView video={this.state.video} actors={this.state.actors} avatars={this.state.avatars} />
                                        <RelatedView videoId={video ? video.id : 0} list={this.state.relatedList} source={this.props.source} />
                                        <CommentaryView comments={this.state.video.get('marketComments')[0].comments} />
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
