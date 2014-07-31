/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        'IO',
        'Actions',
        'Wording',
        'main/models/VideoModel',
        'mixins/FilterNullValues',
        'mixins/ElementsGenerator',
        'utilities/QueryHelper',
        'utilities/FormatDate',
        'utilities/FormatString',
        'components/LoadingView',
        'components/TabView',
        'components/DownloadListView',
        'components/SubscribeBubbleView',
        'components/SeriesVersionView'
    ], function (
        React,
        _,
        IO,
        Actions,
        Wording,
        VideoModel,
        FilterNullValues,
        ElementsGenerator,
        QueryHelper,
        FormatDate,
        FormatString,
        LoadingView,
        TabView,
        DownloadListView,
        SubscribeBubbleView,
        SeriesVersionView
    ) {

        var queryFlag = 0;

        var querySeries = function (id, type) {
            var deferred = $.Deferred();

            IO.requestAsync({
                url : Actions.actions[type.toUpperCase()] + id,
                data : {
                        opt_fields : [
                            'list.title',
                            'list.type',
                            'list.id',
                            'list.actors.*',
                            'list.cover.*',
                            'list.marketRatings.rating',
                            'title'
                        ].join(',')
                },
                success : function (data) {
                    deferred.resolve(data);
                },
                error : deferred.reject
            });

            return deferred.promise();
        };

        var SeriesView = React.createClass({
            mixins : [ElementsGenerator],
            getInitialState : function () {
                return {
                    seriesTitle : '',
                    series : [],
                    versions : [],
                    list : [],
                    loadingList : true,
                    tabs : ['tab_newest'],
                    selectedTab : 'tab_newest',
                    origin : this.props.origin,
                    video : new VideoModel(FilterNullValues.filterNullValues.call(FilterNullValues, this.props.origin))

                };
            },
            componentWillMount : function () {
                this.subscribeBubbleView = <SubscribeBubbleView video={this.state.video} subscribeHandler={this.subscribeCallback} />
            },
            componentDidMount : function() {
                var video = this.props.origin || {};
                if (video.videoSeries_id && !queryFlag) {
                    var series = [];
                    var versions = [];
                    queryFlag = 2;
                    querySeries(video.videoSeries_id, 'series').done(function (resp) {
                        queryFlag--;
                        series = resp.list || [];
                        if (series && versions !== null) {
                            this.setState({
                                series : series,
                                seriesTitle : this.state.title ? this.state.title : resp.title,
                                list : series.concat(versions)
                            });
                        }
                    }.bind(this));

                    querySeries(video.videoSeries_id, 'versions').done(function (resp) {
                        queryFlag--;
                        versions = resp.list || [];
                        if (versions && series !== null) {
                            this.setState({
                                versions : versions,
                                seriesTitle : this.state.title ? this.state.title : resp.title,
                                list : series.concat(versions)
                            });
                        }
                    }.bind(this));
                }

                if (video.latestEpisodeNum && video.type !== 'MOVIE') {
                    var max = video.latestEpisodeNum > 60 ? 20 : video.latestEpisodeNum;
                    this.loopLoad(video.id, 0, max);

                    var tabs = this.state.tabs;
                    var times = Math.ceil(video.latestEpisodeNum / 100);
                    var tmpArr = Array.apply(null, {length: times}).map(Number.call, Number);
                    _.each(tmpArr, function (item, index) {
                        if ((index+1)*100 <= video.latestEpisodeNum) {
                            tabs.push((index*100 + 1) + '-' + (index+1)*100);
                        } else {
                            tabs.push((index*100 + 1) + '-' + video.latestEpisodeNum);
                        }
                    });
                    this.setState({
                        tabs : tabs
                    });
                } else if (video.type === 'VARIETY') {
                    QueryHelper.queryEpisodesAsync(video.id).done(function (resp) {
                        var origin = this.props.origin;
                        origin.videoEpisodes = resp.videoEpisodes;
                        var videoModle = new VideoModel(FilterNullValues.filterNullValues.call(FilterNullValues, origin));

                        this.setState({
                            loadingList : false,
                            origin : origin,
                            video : videoModle
                        });

                    }.bind(this));
                }
            },
            loopLoad : function (id, start, size) {
                var times = Math.ceil((size % 100 || 100)/20);
                var totalSize = this.state.video.get('latestEpisodeNum') || size;
                var result = new Array(totalSize);

                var LIMIT = 20;

                for (var i = 0; i < times; i++) {

                    var max = (size - i*LIMIT >= 20) ? 20 : size - i*LIMIT;

                    QueryHelper.queryEpisodesAsync(id, start + i*LIMIT, max).done(function (resp) {
                        _.each(resp.videoEpisodes, function (item) {
                            result[item.episodeNum - 1] = item;
                        });

                        if (i >= times && result.length) {
                            var origin = this.props.origin;
                            origin.videoEpisodes = result;
                            var videoModle = new VideoModel(FilterNullValues.filterNullValues.call(FilterNullValues, origin));

                            this.setState({
                                loadingList : false,
                                origin : origin,
                                video : videoModle
                            });

                            this.props.videoCallback.call(this, videoModle);
                        }

                    }.bind(this));
                }
            },
            selectTab : function (tab) {
                var tabs = this.state.tabs;
                if (tabs.indexOf(tab) > 3) {
                    tabs.splice(4, 0, tab);
                    this.setState({
                        tabs : tabs
                    });
                }
                this.setState({
                    loadingList : true,
                    tabs : tabs,
                    selectedTab : tab
                });

                var show = this.getShow(tab);
                this.loopLoad(this.state.video.id, this.state.video.get('latestEpisodeNum') - show.split('-')[1], show.split('-')[1] - show.split('-')[0] + 1);
            },
            subscribeCallback : function (statusCode) {
                this.props.subscribeHandler.call(this, statusCode);
            },
            getDownloadTab : function () {
                var video = this.props.origin || {};
                if (video.latestEpisodeNum && video.latestEpisodeNum > 60) {

                    return (
                        <TabView type="download" totalSize={video.latestEpisodeNum} tabs={this.state.tabs} selectedTab={this.state.selectedTab} selectTab={this.selectTab} />
                    );
                }
            },
            getShow : function (tab) {
                var video = this.props.origin;
                var selectedTab = tab ? tab : this.state.selectedTab;
                var show;
                if (selectedTab === 'tab_newest') {
                    show = (video.latestEpisodeNum-20+1) + '-' + video.latestEpisodeNum;
                } else if (selectedTab.indexOf('-' > 0)) {
                    show = selectedTab;
                }

                if (video.latestEpisodeNum && video.latestEpisodeNum <= 60) {
                    show = '1-' + video.latestEpisodeNum;
                } else if (video.type === 'VARIETY') {
                    show = 'all';
                }
                return show;
            },
            getList : function () {
                var video = this.state.video;
                if (video && video.type !== 'MOVIE' && !this.state.loadingList) {
                    return <DownloadListView id={video.id} show={this.getShow()} video={video} origin={this.state.origin} />
                } else {
                    return <LoadingView show={this.state.loadingList} />
                }
            },
            getStatus : function () {
                video= this.props.origin || {};
                if (video.type === 'TV' || video.type === 'COMIC') {
                    if (video.latestEpisodeNum === video.totalEpisodesNum) {
                        copy = Wording.TOTLE_COMPLATE;
                    } else {
                        copy = Wording.LAST_EPISODE;
                    }
                    return <h6 className="w-text-secondary series-title">{FormatString(copy, [video.latestEpisodeNum])}</h6>
                } else if (video.latestEpisodeDate) {
                    return <h6 className="w-text-secondary series-title">{Wording.UPDATE_TIME + ' ' + FormatDate('MM月dd日', video.latestEpisodeDate)}</h6>
                }
            },
            render : function () {
                var video = this.props.origin || {};
                if (video.type !== 'MOVIE') {
                    return (
                        <div className="w-cf row row-series">
                            {this.getStatus()}
                            {this.getSubscribeBtn('subscribe')}
                            {this.subscribeBubbleView}
                            {this.getDownloadTab()}
                            {this.getList()}
                            <SeriesVersionView id={this.props.id} list={this.state.list} title={this.state.seriesTitle} source={this.props.source} />
                        </div>
                    );
                } else {
                    return (
                        <div />
                    );
                }
            }
        });

        return SeriesView;
    });
}(this));
