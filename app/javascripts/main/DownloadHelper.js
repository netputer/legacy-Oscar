/*global define*/
(function (window) {
    define([
        'IO',
        '_',
        '$',
        'GA',
        'Actions',
        'utilities/ClientInfo'
    ], function (
        IO,
        _,
        $,
        GA,
        Actions,
        ClientInfo
    ) {
        var DownloadHelper = {};

        var dservice = true;

        var providers;

        var clientVersion = ClientInfo.getVersion();


        // (function () {
        //     var ua = window.navigator.userAgent.split(' ');
        //     var version = ua[ua.length - 1];
        //     var v = version.split('.')[1];
        //     dservice = parseInt(v, 10) >= 65;
        // }());

        var downloadAsync = function (title, url, isDservice) {
            var deferred = $.Deferred();

            IO.requestAsync({
                url : Actions.actions.VIDEO_DOWNLOAD,
                data : {
                    url : url + '&source=windows2x',
                    name : title,
                    icon : '',
                    pos : 'oscar-dora-ext',
                    dservice : isDservice
                }
            });

            return deferred.promise();
        };

        var batchDownloadAsync = function (data) {
            var deferred = $.Deferred();
 
            IO.requestAsync({
                url : Actions.actions.BATCH_DOWNLOAD + '?source=windows2x',
                type : 'POST',
                data : {
                    videos : data
                }
            });

            return deferred.promise();
        };


        var getProvidersAsync = function () {
            var deferred = $.Deferred();
            $.ajax({
                url : Actions.actions.PROVIDERS,
                success : deferred.resolve
            });
            return deferred.promise();
        };

        DownloadHelper.downloadPlayerAsync = function (provider) {
            if (provider.title !== undefined) {
                var title = provider.title;
                var icon = provider.iconUrl;
                var url = provider.appDownloadUrl + '?pos=oscar-promotion#name=' + title + '&icon=' + icon + '&content-type=application';
                $('<a>').attr({'href' : url, 'download' : title})[0].click();
                sessionStorage.setItem(title, 'installed');

               GA.log({
                    'event' : 'video.app.promotion'
                });

                return true;
            } else {
                return false;
            }
        };

        DownloadHelper.download = function (episodes, eleIndex) {
            if (episodes.length > 1) {
                var data = [];
                _.each(episodes, function (item) {
                    if (item.downloadUrls) {
                        var downloadURL = item.downloadUrls[0];
                        var dServiceURL = downloadURL.accelUrl;
                        var url = downloadURL.url;
                        var downloadInfo = {};
                        downloadInfo.title = item.title;
                        downloadInfo.size = downloadURL.size;
                        downloadInfo.dservice = dservice;

                        if (dservice) {
                            url = dServiceURL;
                            downloadInfo.url = dServiceURL;
                        } else {
                            downloadInfo.url = url;
                        }
                        if (clientVersion > 2.68) {
                            data.push(downloadInfo);
                        } else {
                            downloadAsync(item.title, url, dservice);
                        }
                    }
                });
                if (clientVersion > 2.68) {
                    batchDownloadAsync(data);
                }
            } else {
                episode = episodes[0];

                var downloadURL = episode.downloadUrls[0];
                var dServiceURL = downloadURL.accelUrl;
                var url = downloadURL.url;

                if (dservice) {
                    downloadAsync(episode.title, dServiceURL, dservice);
                } else {
                    downloadAsync(episode.title, url, dservice);
                }
            }
        };

        DownloadHelper.getProviders = function () {
            if (providers) {
                return providers;
            } else {
                return getProvidersAsync().then(function (resp) {
                    providers = resp;
                    return providers;
                });
            }
        };

        DownloadHelper.downloadFromProvider = function (episode, provider, index) {
            var title = episode.title;
            var url = provider.url;
            var dServiceURL = provider.accelUrl;
            var eleIndex = index !== undefined ? index : 0;

            if (dservice) {
                downloadAsync(title, dServiceURL, dservice);
            } else {
                downloadAsync(title, url, dservice);
            }

        };

        return DownloadHelper;
    });
}(this));
