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

        var providers;

        (function () {
            var ua = window.navigator.userAgent.split(' ');
            var version = ua[ua.length - 1];
            var v = version.split('.')[1];
            dservice = parseInt(v, 10) >= 65;
        }());

        var downloadAsync = function (title, url) {
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


        var getProvidersAsync = function () {
            var deferred = $.Deferred();
            $.ajax({
                url : Actions.actions.PROVIDERS,
                success : deferred.resolve
            })
            return deferred.promise();
        };

        var downloadPlayerAsync = function(title) {
            _.some(providers, function (provider) {
                if (title === provider.title) {
                    console.log(provider)
                    var icon = provider.iconUrl;
                    var url = provider.appDownloadUrl + '?pos=oscar-promotion#name=' + title + '&icon=' + icon + '&content-type=application';
                    $('<a>').attr({'href' : url, 'download' : title})[0].click();
                    sessionStorage.setItem(title, 'installed');
                    return true;
                } else {
                    return false;
                }
            });
        };

        var downloadPlayer = function(player, title, index) {
            if (player.promotType & 1 && sessionStorage.getItem(player.providerName) === null) {
                var downloadAppText = '同时为您下载' + player.providerName + '...';
                var eleIndex = index !== undefined ? index : 0;
                var ele = document.getElementsByClassName('bubble-download-tips')[eleIndex];
                var cachedHtml = ele.innerHTML;
                ele.innerHTML = downloadAppText;
                ele.style.opacity = '1';

                setTimeout(function () {
                    ele.style.opacity = '';
                    ele.innerHTML = cachedHtml;
                }, 3000)

                if (providers === undefined) {
                    getProvidersAsync().done(function (resp) {
                        providers = resp;
                        downloadPlayerAsync(player.providerName);
                    });
                } else {
                    downloadPlayerAsync(player.providerName)
                }

            }
        };

        DownloadHelper.download = function (episodes, installPlayer, eleIndex) {
            if (episodes.length > 1) {
                _.each(episodes, function (item) {
                    if (item.downloadUrls) {
                        var downloadURL = item.downloadUrls[0];
                        var dServiceURL = downloadURL.accelUrl;
                        var url = downloadURL.url;
                        if (dservice) {
                            downloadAsync(item.title, dServiceURL);
                        } else {
                            downloadAsync(item.title, url);
                        }
                    }
                });
            } else {
                episode = episodes[0];

                if (!!installPlayer) {
                    downloadPlayer(episode.downloadUrls[0], episode.title, eleIndex);
                }

                var downloadURL = episode.downloadUrls[0];
                var dServiceURL = downloadURL.accelUrl;
                var url = downloadURL.url;

                if (dservice) {
                    downloadAsync(episode.title, dServiceURL);
                } else {
                    downloadAsync(episode.title, url);
                }
            }
        };

        DownloadHelper.downloadFromProvider = function (episode, provider, installPlayer, index) {
            var title = episode.title;
            var url = provider.url;
            var dServiceURL = provider.accelUrl;
            var eleIndex = index !== undefined ? index : 0;

            if (!!installPlayer) {
                downloadPlayer(provider, title, eleIndex);
                GA.log({
                    'event' : 'video.download.action',
                    'action' : 'video_app_download',
                    'pos' : 'detail',
                    'video_id' : episode.video_id,
                    'video_source' : title,
                    'video_title' : episode.title
                });

            }

            if (dservice) {
                downloadAsync(title, dServiceURL);
            } else {
                downloadAsync(title, url);
            }

        };

        return DownloadHelper;
    });
}(this));
