/** @jsx React.DOM */
/*global define*/
(function (window, document) {
    define([
        'React',
        'Backbone',
        'IO',
        'GA',
        'Actions',
        'catepage/CatePage',
        'catepage/CatePageRouter',
        'main/models/VideoModel',
        'components/SeriesDetailPanelView',
        'mixins/FilterNullValues'
    ], function (
        React,
        Backbone,
        IO,
        GA,
        Actions,
        CatePage,
        CatePageRouter,
        VideoModel,
        SeriesDetailPanelView,
        FilterNullValues
    ) {
        var catePageRouter = CatePageRouter.getInstance();

        var queryAsync = function (id) {
            var deferred = $.Deferred();

            IO.requestAsync({
                url : Actions.actions.QUERY_SERIES + id,
                success : deferred.resolve,
                error : deferred.reject
            });

            return deferred.promise();
        };

        var closeDetailPanel = function () {
            catePageRouter.navigate(window.location.hash.split('/')[0], {
                trigger : true
            });
        };

        var seriesDetailPanelView = <SeriesDetailPanelView closeDetailPanel={closeDetailPanel} />

        React.renderComponent((
            <div>
                <CatePage />
                {seriesDetailPanelView}
            </div>
        ), document.body);

        catePageRouter.on('route:filter', function (cate, id) {
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

                GA.log({
                    'event' : 'video.common.action',
                    'action' : 'detail_view',
                    'video_id' : id,
                    'pos' : cate
                });
            } else {
                seriesDetailPanelView.setState({
                    show : false
                });
            }

            GA.log({
                'event' : 'video.common.action',
                'action' : 'tab_view',
                'type' : cate
            });
        });

        Backbone.history.start();

        $('body').on('keydown', function (evt) {
            if (evt.keyCode === 27) {
                closeDetailPanel();
            }
        });
    });
}(this, this.document));
