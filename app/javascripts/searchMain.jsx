/** @jsx React.DOM */
/*global define*/
(function (window, document) {
    define([
        'React',
        'Backbone',
        'IO',
        'Actions',
        'searchpage/SearchPageRouter',
        'searchpage/SearchPage',
        'components/SeriesDetailPanelView',
        'mixins/FilterNullValues',
        'main/models/VideoModel'
    ], function (
        React,
        Backbone,
        IO,
        Actions,
        SearchPageRouter,
        SearchPage,
        SeriesDetailPanelView,
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
            searchPageRouter.navigate('#q/' + searchPageRouter.getQuery(), {
                trigger : true
            });
        };

        var seriesDetailPanelView = <SeriesDetailPanelView closeDetailPanel={closeDetailPanel} />

        searchPageRouter.on('route:search', function (query, id) {
            if (id) {
                seriesDetailPanelView.setState({
                    show : true,
                    loading : true
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
        });

        React.renderComponent(
            <div>
                <SearchPage />
                {seriesDetailPanelView}
            </div>
        , document.body);

        Backbone.history.start();

        $('body').on('keydown', function (evt) {
            if (evt.keyCode === 27) {
                closeDetailPanel();
            }
        });
    });
}(this, this.document));
