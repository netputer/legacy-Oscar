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
        'IO',
        'components/searchbox/SearchBoxView'
    ], function (
        React,
        IO,
        SearchBoxView
    ) {
        React.renderComponent(SearchBoxView(null ), document.getElementsByClassName('o-search-box-ctn')[0]);
    });
}(this, document));


(function (window, document) {
    require([
        '$',
        'React',
        'IO',
        'components/VideoListView'
    ], function (
        $,
        React,
        IO,
        VideoListView
    ) {

        var queryAsync = function () {
            var deferred = $.Deferred();

            $.ajax({
                url : 'http://oscar.wandoujia.com/api/v1/search/',
                data : {
                    mixed : true,
                    max : 4,
                    start : 0
                },
                success : deferred.resolve,
                error : deferred.reject
            });

            return deferred.promise();
        };

        queryAsync().done( function (resp){
            React.renderComponent(VideoListView( {data:resp.videoList}), $('.sample-VideoListView')[0]);
        });
    });
}(this, document));

(function (window, document) {
    require([
        '$',
        'React',
        'IO',
        'components/DescriptionView'
    ], function (
        $,
        React,
        IO,
        DescriptionView
    ) {

        var queryAsync = function () {
            var deferred = $.Deferred();

            $.ajax({
                url : 'http://oscar.wandoujia.com/api/v1/videos/49194',
                success : deferred.resolve,
                error : deferred.reject
            });

            return deferred.promise();
        };

        queryAsync().done(function (resp) {

            var data = {
                description : resp.description
            };

            React.renderComponent(DescriptionView( {data:data}), $('.sample-DescriptionView')[0]);
        });

    });
}(this, document));

(function (window, document) {
    require([
        '$',
        'React',
        'IO',
        'components/DownloadListView'
    ], function (
        $,
        React,
        IO,
        DownloadListView
    ) {

        var queryAsync = function () {
            var deferred = $.Deferred();

            $.ajax({
                url : 'http://oscar.wandoujia.com/api/v1/videos/49194',
                success : deferred.resolve,
                error : deferred.reject
            });

            return deferred.promise();
        };

        queryAsync().done(function (resp) {

            var data = {
                videoEpisodes : resp.videoEpisodes
            };

            React.renderComponent(DownloadListView( {data:data}), $('.sample-DownloadListView')[0]);
        });

    });
}(this, document));

(function (window, document) {
    require([
        '$',
        'React',
        'IO',
        'components/BannerView'
    ], function (
        $,
        React,
        IO,
        BannerView
    ) {

        var queryAsync = function (vid) {
            var deferred = $.Deferred();

            $.ajax({
                url : 'http://oscar.wandoujia.com/api/v1/videos/' + vid,
                success : deferred.resolve,
                error : deferred.reject
            });

            return deferred.promise();
        };

        queryAsync('49194').done(function (resp) {
            React.renderComponent(BannerView( {data:resp}), $('.sample-BannerView-tv')[0]);
        });

        queryAsync('42226').done(function (resp) {
            React.renderComponent(BannerView( {data:resp}), $('.sample-BannerView-movie')[0]);
        });

        queryAsync('28162').done(function (resp) {
            React.renderComponent(BannerView( {data:resp}), $('.sample-BannerView-variety')[0]);
        });

    });
}(this, document));

(function (window, document) {
    require([
        '$',
        'React',
        'IO',
        'components/PicturesView'
    ], function (
        $,
        React,
        IO,
        PicturesView
    ) {

        var queryAsync = function (vid) {
            var deferred = $.Deferred();

            $.ajax({
                url : 'http://oscar.wandoujia.com/api/v1/videos/' + vid,
                success : deferred.resolve,
                error : deferred.reject
            });

            return deferred.promise();
        };

        queryAsync('42226').done(function (resp) {

            var data = resp.pictures;
            React.renderComponent(PicturesView( {data:data}), $('.sample-PicturesView')[0]);
        });

    });
}(this, document));
