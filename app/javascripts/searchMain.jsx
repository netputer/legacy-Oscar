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
        'searchpage/SearchPageRouter',
        'searchpage/SearchPage',
        'components/SeriesDetailPanelView',
        'components/DownloadTipView',
        'components/DeclarationView'
    ], function (
        React,
        Backbone,
        IO,
        GA,
        Log,
        Actions,
        QueryHelper,
        SearchPageRouter,
        SearchPage,
        SeriesDetailPanelView,
        DownloadTipView,
        DeclarationView
    ) {
        var searchPageRouter = SearchPageRouter.getInstance();

        var closeDetailPanel = function () {
            seriesDetailPanelView.setState({
                show : false
            });

            searchPageRouter.navigate('#keep', {
                trigger : false
            });
        };

        var seriesDetailPanelView = <SeriesDetailPanelView closeDetailPanel={closeDetailPanel} />

        searchPageRouter.on('route:search', function (id) {
            if (id) {
                seriesDetailPanelView.setState({
                    show : true,
                    loading : true,
                    subscribed : -2
                });

                QueryHelper.queryAsync(id).done(function (resp) {
                    seriesDetailPanelView.setProps({
                        origin : resp,
                        id : id
                    });

                    if (seriesDetailPanelView.isMounted()) {
                        seriesDetailPanelView.setState({
                            loading : false
                        });
                    }

                });
            } else {
                seriesDetailPanelView.setState({
                    show : false
                });
            }

            Log.pageShow();

        });

        React.renderComponent(
            <div>
                <SearchPage />
                {seriesDetailPanelView}
                <DownloadTipView />
                <DeclarationView />
            </div>
        , document.body);

        Backbone.history.start();
        Log.pageShow();

        $('body').on('keydown', function (evt) {
            if (evt.keyCode === 27) {
                closeDetailPanel();
            }
        });
    });
}(this, this.document));
