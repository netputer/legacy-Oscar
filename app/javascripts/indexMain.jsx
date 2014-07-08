/** @jsx React.DOM */
/*global define*/
(function (window, document) {
    define([
        'React',
        'Backbone',
        'IO',
        'GA',
        'main/Log',
        'Actions',
        'indexpage/IndexPage',
        'indexpage/IndexPageRouter',
        'components/DownloadTipView',
        'components/DeclarationView',
        'components/SeriesDetailPanelView',
        'mixins/FilterNullValues',
        'main/models/VideoModel',
        'components/DownloadListView',
        'VideoPlayer'
    ], function (
        React,
        Backbone,
        IO,
        GA,
        Log,
        Actions,
        IndexPage,
        IndexPageRouter,
        DownloadTipView,
        DeclarationView,
        SeriesDetailPanelView,
        FilterNullValues,
        VideoModel,
        DownloadListView,
        VideoPlayer
    ) {
        var showFlag = 0;

        var queryAsync = function (id) {
            var deferred = $.Deferred();

            IO.requestAsync({
                url : Actions.actions.QUERY_SERIES + id,
                data : {
                    opt_fields : [
                        'title',
                        'type',
                        'id',
                        'description',
                        'actors.*',
                        'cover.*',
                        'categories.name',
                        'latestEpisodeNum',
                        'latestEpisodeDate',
                        'totalEpisodesNum',
                        'marketRatings.rating',
                        'marketComments.*',
                        'categories.*',
                        'pictures.s',
                        'providerNames.*',
                        'year',
                        'presenters'
                    ].join(',')
                },
                success : deferred.resolve,
                error : deferred.reject
            });

            return deferred.promise();
        };

        var indexPageRouter = IndexPageRouter.getInstance();

        var closeDetailPanel = function () {
            indexPageRouter.navigate('#index', {
                trigger : true
            });
        };

        var declarationView = <DeclarationView />
        var seriesDetailPanelView = <SeriesDetailPanelView closeDetailPanel={closeDetailPanel} />

        React.renderComponent((
            <div>
                <IndexPage />
                {seriesDetailPanelView}
                <DownloadTipView />
                <DeclarationView />
            </div>
        ), document.body);

        indexPageRouter.on('route:detail', function (query) {
            seriesDetailPanelView.setState({
                show : true,
                loading : true,
                subscribed : -2
            });

            queryAsync(query).done(function (resp) {
                var videoModle = new VideoModel(FilterNullValues.filterNullValues.call(FilterNullValues, resp));
                seriesDetailPanelView.setProps({
                    video : videoModle,
                    origin : resp,
                    id : query
                });

                if (seriesDetailPanelView.isMounted()) {
                    seriesDetailPanelView.setState({
                        loading : false
                    });
                }

                Log.pageShow();

            });

        });

        indexPageRouter.on('route:index', function () {
            if (seriesDetailPanelView.isMounted()) {
                seriesDetailPanelView.setState({
                    show : false
                });
            }

            if (!showFlag) {
                Log.updateUrl();
                Log.pageShow();
                showFlag = 1;
            }
        });

        Backbone.history.start();
        if (location.href.indexOf('detail/') < 0 && !showFlag) {
            Log.pageShow();
            showFlag = 1;
        }

        $('body').on('keydown', function (evt) {
            if (evt.keyCode === 27) {
                if (VideoPlayer.isShow) {
                    VideoPlayer.close();
                } else {
                    closeDetailPanel();
                }
            }
        });
    });
}(this, this.document));
