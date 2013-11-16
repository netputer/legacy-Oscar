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

        var dservice = false;

        (function () {
            var ua = window.navigator.userAgent.split(' ');
            var version = ua[ua.length - 1];
            var v = version.split('.')[1];
            dservice = parseInt(v, 10) >= 65;
        }());

        var downloadAsync = function (title, url) {
            console.log(title);
            var deferred = $.Deferred();
            IO.requestAsync({
                url : Actions.actions.VIDEO_DOWNLOAD,
                data : {
                    url : url,
                    name : title,
                    icon : '',
                    pos : 'oscar-dora-ext',
                    dservice : dservice
                }
            });

            return deferred.promise();
        };

        DownloadHelper.download = function (episodes) {
            if (episodes.length > 1) {
                _.each(episodes, function (item) {
                    if (item.downloadUrls) {
                        var downloadURL = item.downloadUrls[0];
                        var dServiceURL = downloadURL.accelUrl;
                        var url = downloadURL.url;
                        console.log();
                        if (dservice) {
                            downloadAsync(item.title, dServiceURL);
                        } else {
                            downloadAsync(item.title, url);
                        }
                    }
                });
            } else {
                episodes = episodes[0];

                var downloadURL = episodes.downloadUrls[0];
                var dServiceURL = downloadURL.accelUrl;
                var url = downloadURL.url;

                if (dservice) {
                    downloadAsync(episodes.title, dServiceURL);
                } else {
                    downloadAsync(episodes.title, url);
                }
            }
        };

        DownloadHelper.downloadFromProvider = function (title, provider) {
            var url = provider.url;
            var dServiceURL = provider.accelUrl;

            if (dservice) {
                downloadAsync(title, dServiceURL);
            } else {
                downloadAsync(title, url);
            }

        };

        return DownloadHelper;
    });
}(this));
