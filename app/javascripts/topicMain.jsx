/** @jsx React.DOM */
/*global define*/
(function (window, document) {
    define([
        'React',
        'Backbone',
        'IO',
        'GA',
        'Actions',
        'main/Log',
        'utilities/QueryHelper',
        'topicpage/TopicPage',
        'topicpage/TopicPageRouter',
        'components/SeriesDetailPanelView'
    ], function (
        React,
        Backbone,
        IO,
        GA,
        Actions,
        Log,
        QueryHelper,
        TopicPage,
        topicPageRouter,
        SeriesDetailPanelView
    ) {
        var topicPageRouter = topicPageRouter.getInstance();


        var closeDetailPanel = function () {
            seriesDetailPanelView.setState({
                show : false
            });
        
            topicPageRouter.navigate('keep', {
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

        topicPageRouter.on('route:topic', function (id) {
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
                    Log.pageShow();
                });

            } else {
                seriesDetailPanelView.setState({
                    show : false
                });
            }

        });

        Backbone.history.start();
        Log.pageShow();

        $('body').on('keydown', function (evt) {
            if (evt.keyCode === 27) {
                closeDetailPanel();
            }
        });
    });
}(this, this.document));
