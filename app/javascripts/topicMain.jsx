/** @jsx React.DOM */
/*global define*/
(function (window, document) {
    define([
        'React',
        'Backbone',
        'IO',
        'GA',
        'Actions',
        'topicpage/TopicPage',
        'topicpage/TopicPageRouter',
        'main/models/VideoModel',
        'components/SeriesDetailPanelView',
        'mixins/FilterNullValues'
    ], function (
        React,
        Backbone,
        IO,
        GA,
        Actions,
        TopicPage,
        topicPageRouter,
        VideoModel,
        SeriesDetailPanelView,
        FilterNullValues
    ) {
        var topicPageRouter = topicPageRouter.getInstance();

        var queryAsync = function (id) {
            var deferred = $.Deferred();

            IO.requestAsync({
                url : Actions.actions.QUERY_SERIES + '/' + id,
                success : deferred.resolve,
                error : deferred.reject,
                cache : true,
                ifModified : false,
            });

            return deferred.promise();
        };

        var closeDetailPanel = function () {
            seriesDetailPanelView.setState({
                show : false
            });
        
            topicPageRouter.navigate(window.location.hash.split('/')[0], {
                trigger : false
            });
        };

        var seriesDetailPanelView = <SeriesDetailPanelView closeDetailPanel={closeDetailPanel} />

        React.renderComponent((
            <div>
                <TopicPage />
                {seriesDetailPanelView}
            </div>
        ), document.body);

        topicPageRouter.on('route:filter', function (topic, id) {
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

                GA.log({
                    'event' : 'video.common.action',
                    'action' : 'detail_view',
                    'video_id' : id,
                    'pos' : topic
                });
            } else {
                seriesDetailPanelView.setState({
                    show : false
                });
            }

            GA.log({
                'event' : 'video.common.action',
                'action' : 'tab_view',
                'type' : topic
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
