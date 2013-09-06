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
        'indexpage/IndexPage',
        'indexpage/IndexPageRouter',
        'components/SeriesDetailPanelView',
        'mixins/FilterNullValues',
        'main/models/VideoModel',
        'components/DownloadListView'
    ], function (
        React,
        Backbone,
        IO,
        Actions,
        IndexPage,
        IndexPageRouter,
        SeriesDetailPanelView,
        FilterNullValues,
        VideoModel,
        DownloadListView
    ) {

        React.renderComponent((
            <div>
                <IndexPage />
            </div>
        ), document.body);

        var queryAsync = function (id) {
            var deferred = $.Deferred();

            IO.requestAsync({
                url : Actions.actions.QUERY_SERIES + id,
                success : deferred.resolve,
                error : deferred.reject
            });

            return deferred.promise();
        };

        var indexPageRouter = new IndexPageRouter();

        var seriesDetailPanelView;

        indexPageRouter.on('route:detail', function (query) {
            queryAsync(query).done(function (resp) {
                var videoModle = new VideoModel(FilterNullValues.filterNullVlaues.call(FilterNullValues, resp));

                if (!seriesDetailPanelView) {
                    seriesDetailPanelView = <SeriesDetailPanelView video={videoModle} />;
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
                        <IndexPage />
                        {seriesDetailPanelView}
                    </div>
                ), document.body);
            });
        });

        indexPageRouter.on('route:index', function () {
            React.renderComponent((
                <div>
                    <IndexPage />
                </div>
            ), document.body);
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

// (function (window, document) {
//     require([
//         '$',
//         'React',
//         'IO',
//         'components/BannerView'
//     ], function (
//         $,
//         React,
//         IO,
//         BannerView
//     ) {

//         var queryAsync = function (vid) {
//             var deferred = $.Deferred();

//             $.ajax({
//                 url : 'http://oscar.wandoujia.com/api/v1/videos/' + vid,
//                 success : deferred.resolve,
//                 error : deferred.reject
//             });

//             return deferred.promise();
//         };

//         queryAsync('49194').done(function (resp) {
//             React.renderComponent(<BannerView data={resp}/>, $('.sample-BannerView-tv')[0]);
//         });

//         queryAsync('42226').done(function (resp) {
//             React.renderComponent(<BannerView data={resp}/>, $('.sample-BannerView-movie')[0]);
//         });

//         queryAsync('28162').done(function (resp) {
//             React.renderComponent(<BannerView data={resp}/>, $('.sample-BannerView-variety')[0]);
//         });

//     });
// }(this, document));

// (function (window, document) {
//     require([
//         '$',
//         'React',
//         'IO',
//         'components/PicturesView'
//     ], function (
//         $,
//         React,
//         IO,
//         PicturesView
//     ) {

//         var queryAsync = function (vid) {
//             var deferred = $.Deferred();

//             $.ajax({
//                 url : 'http://oscar.wandoujia.com/api/v1/videos/' + vid,
//                 success : deferred.resolve,
//                 error : deferred.reject
//             });

//             return deferred.promise();
//         };

//         queryAsync('42226').done(function (resp) {

//             var data = resp.pictures;
//             React.renderComponent(<PicturesView data={data}/>, $('.sample-PicturesView')[0]);
//         });

//     });
// }(this, document));
