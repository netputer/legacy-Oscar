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
        'utilities/QueryHelper',
        'indexpage/IndexPage',
        'indexpage/IndexPageRouter',
        'components/DownloadTipView',
        'components/DeclarationView',
        'components/SeriesDetailPanelView',
        'components/DownloadListView',
        'VideoPlayer'
    ], function (
        React,
        Backbone,
        IO,
        GA,
        Log,
        Actions,
        QueryHelper,
        IndexPage,
        IndexPageRouter,
        DownloadTipView,
        DeclarationView,
        SeriesDetailPanelView,
        DownloadListView,
        VideoPlayer
    ) {
        var showFlag = 0;

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

            QueryHelper.queryAsync(query).done(function (resp) {
                seriesDetailPanelView.setProps({
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
