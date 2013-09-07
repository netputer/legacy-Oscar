/** @jsx React.DOM */
require.config({
    paths : {
        $ : '../components/jquery/jquery',
        _ : '../components/underscore/underscore',
        Backbone : '../components/backbone/backbone',
        React : '../components/react/react'
    },
    shim : {
        $ : {
            deps : [],
            exports : '$'
        },
        _ : {
            deps : [],
            exports : '_'
        },
        Backbone : {
            deps : ['$', '_'],
            exports : 'Backbone'
        }
    }
});

(function (window, document) {
    require([
        'React',
        'Backbone',
        'IO',
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
        Actions,
        CatePage,
        CatePageRouter,
        VideoModel,
        SeriesDetailPanelView,
        FilterNullValues
    ) {
        React.renderComponent((
            <div>
                <CatePage />
            </div>
        ), document.body);

        var catePageRouter = CatePageRouter.getInstance();

        var seriesDetailPanelView;

        var queryAsync = function (id) {
            var deferred = $.Deferred();

            IO.requestAsync({
                url : Actions.actions.QUERY_SERIES + id,
                success : deferred.resolve,
                error : deferred.reject
            });

            return deferred.promise();
        };

        var closeDetailPanel = function () {};

        catePageRouter.on('route:filter', function (cate, id) {
            if (id) {
                queryAsync(id).done(function (resp) {
                    var videoModle = new VideoModel(FilterNullValues.filterNullValues.call(FilterNullValues, resp));

                    if (!seriesDetailPanelView) {
                        seriesDetailPanelView = <SeriesDetailPanelView video={videoModle} closeDetailPanel={closeDetailPanel} />;
                    } else {
                        seriesDetailPanelView.setProps({
                            video : videoModle
                        });
                        seriesDetailPanelView.setState({
                            show : true
                        });
                    }
                    React.renderComponent((
                        <div>
                            <CatePage />
                            {seriesDetailPanelView}
                        </div>
                    ), document.body);
                });
            }
        });

        Backbone.history.start();

        $('body').on('keydown', function (evt) {
            if (evt.keyCode === 27) {
                seriesDetailPanelView.setState({
                    show : false
                });
            }
        });
    });
}(this, this.document));
