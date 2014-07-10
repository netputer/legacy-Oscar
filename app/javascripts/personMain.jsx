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
        'personpage/PersonPageRouter',
        'personpage/PersonPage',
        'components/SeriesDetailPanelView',
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
        PersonPageRouter,
        PersonPage,
        SeriesDetailPanelView,
        DeclarationView,
        FilterNullValues,
        VideoModel
    ) {
        var personPageRouter = PersonPageRouter.getInstance();

        var queryAsync = function (id) {
            var deferred = $.Deferred();

            IO.requestAsync({
                url : Actions.actions.QUERY_SERIES + id,
                data : {
                    sessionId : window.sessionId || '',
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
                        'videoEpisodes.*',
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

        var closeDetailPanel = function () {
            seriesDetailPanelView.setState({
                show : false
            });

            personPageRouter.navigate('#keep', {
                trigger : false
            });
        };

        var seriesDetailPanelView = <SeriesDetailPanelView closeDetailPanel={closeDetailPanel} />

        personPageRouter.on('route:detail', function (id) {
            if (id) {
                seriesDetailPanelView.setState({
                    show : true,
                    loading : true,
                    subscribed : -2
                });

                queryAsync(id).done(function (resp) {
                    var videoModle = new VideoModel(FilterNullValues.filterNullValues.call(FilterNullValues, resp));

                    seriesDetailPanelView.setProps({
                        video : videoModle,
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
                <PersonPage />
                {seriesDetailPanelView}
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
