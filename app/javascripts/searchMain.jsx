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
        'searchpage/SearchPageRouter',
        'searchpage/SearchPage',
        'components/SeriesDetailPanelView',
        'components/DownloadTipView',
        'components/DeclarationView',
        'mixins/FilterNullValues',
        'main/models/VideoModel'
    ], function (
        React,
        Backbone,
        IO,
        GA,
        Log,
        Actions,
        SearchPageRouter,
        SearchPage,
        SeriesDetailPanelView,
        DownloadTipView,
        DeclarationView,
        FilterNullValues,
        VideoModel
    ) {
        var searchPageRouter = SearchPageRouter.getInstance();

        var queryAsync = function (id) {
            var deferred = $.Deferred();

            IO.requestAsync({
                url : Actions.actions.QUERY_SERIES + id,
                data : {
                    sessionId : window.sessionId || ''
                },
                success : deferred.resolve,
                error : deferred.reject
            });

            return deferred.promise();
        };

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

                queryAsync(id).done(function (resp) {
                    var videoModle = new VideoModel(FilterNullValues.filterNullValues.call(FilterNullValues, resp));

                    seriesDetailPanelView.setProps({
                        video : videoModle
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
