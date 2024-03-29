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
                    tabs : ['tab_newest'],
                    selectedTab : 'tab_newest'
                };
            },
            componentWillMount : function () {
                this.subscribeBubbleView = <SubscribeBubbleView video={this.props.video} subscribeHandler={this.subscribeCallback} />
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
                }
            },
            componentWillReceiveProps : function (newProps) {
                if (this.refs) {
                    this.refs['loading'].getDOMNode().style.display = 'none';
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
                    tabs : tabs,
                    selectedTab : tab
                });

                var show = this.getShow(tab);
                this.loopLoad(this.props.video.id, this.props.video.get('latestEpisodeNum') - show.split('-')[1], show.split('-')[1] - show.split('-')[0] + 1);
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
            loopLoad : function (id, start, size) {
                this.props.loopLoad.call(this, id, start, size);
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
                            <LoadingView show={true} ref="loading" />
                            <DownloadListView id={this.props.id} show={this.getShow()} video={this.props.video} origin={this.props.origin} />
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
