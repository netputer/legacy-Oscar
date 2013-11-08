/** @jsx React.DOM */
/*global define*/
(function (window, document) {
    define([
        'React',
        'Backbone',
        'IO',
        'GA',
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
        GA,
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
            seriesDetailPanelView.setState({
                show : false
            });

            searchPageRouter.navigate('#q/' + searchPageRouter.getQuery(), {
                trigger : false
            });
        };

        var seriesDetailPanelView = <SeriesDetailPanelView closeDetailPanel={closeDetailPanel} />

        searchPageRouter.on('route:search', function (query, id) {
            if (id) {
                seriesDetailPanelView.setState({
                    show : true,
                    loading : true,
                    subscribed : 0
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

                GA.log({
                    'event' : 'video.common.action',
                    'action' : 'detail_view',
                    'video_id' : id,
                    'pos' : 'search'
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
