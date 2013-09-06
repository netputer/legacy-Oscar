/*global define*/
(function (window) {
    define([
        'IO',
        '_',
        '$',
        'Actions'
    ], function (
        IO,
        _,
        $,
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
                },
                success : function (resp) {
                    console.log(resp);
                }
            });

            return deferred.promise();
        };

        DownloadHelper.download = function (episodes) {
            if (episodes.length > 1) {
                var title = episodes[0].title;
                _.each(episodes, function (item) {
                    if (item.downloadUrls) {
                        var downloadURL = item.downloadUrls[0];
                        var dServiceURL = downloadURL.accelUrl;
                        var url = downloadURL.url;

                        downloadAsync(title + item.episodeNum, url);
                    }
                });
            } else {
                episodes = episodes[0];
                var downloadURL = episodes.downloadUrls[0];
                var dServiceURL = downloadURL.accelUrl;
                var url = downloadURL.url;
                downloadAsync(episodes.title + (episodes.episodeNum || ''), url);
            }
        };

        return DownloadHelper;
    });
}(this));
