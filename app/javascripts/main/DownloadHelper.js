/*global define*/
(function (window) {
    define([
        'IO',
        '_',
        '$',
        'GA',
        'Actions'
    ], function (
        IO,
        _,
        $,
        GA,
        Actions
    ) {
        var DownloadHelper = {};

        var downloadAsync = function (title, url) {
            var deferred = $.Deferred();
            IO.requestAsync({
                url : Actions.actions.VIDEO_DOWNLOAD,
                data : {
                    url : url,
                    name : title,
                    icon : '',
                    source : 'oscar-dora-ext'
                }
            });

            return deferred.promise();
        };

        var dservice = false;

        DownloadHelper.download = function (episodes) {
            if (episodes.length > 1) {
                var title = episodes[0].title;

                _.each(episodes, function (item) {
                    if (item.downloadUrls) {
                        var downloadURL = item.downloadUrls[0];
                        var dServiceURL = downloadURL.accelUrl;
                        var url = downloadURL.url;

                        if (dservice) {
                            downloadAsync(title + '-' + item.episodeNum, dServiceURL);
                        } else {
                            downloadAsync(title + '-' + item.episodeNum, url);
                        }
                    }
                });

                GA.log('download', 'all', title);
            } else {
                episodes = episodes[0];
                console.log(episodes);

                var downloadURL = episodes.downloadUrls[0];
                var dServiceURL = downloadURL.accelUrl;
                var url = downloadURL.url;
                if (dservice) {
                    downloadAsync(episodes.title + '-' + (episodes.episodeNum || ''), dServiceURL);
                } else {
                    downloadAsync(episodes.title + '-' + (episodes.episodeNum || ''), url);
                }

                GA.log('download', 'episode', episodes.title);
            }
        };

        window.zhuizhuikan = function () {
            dservice = true;
        };

        return DownloadHelper;
    });
}(this));
