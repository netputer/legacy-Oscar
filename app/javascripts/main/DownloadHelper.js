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
                    var icon = provider.iconUrl;
                    var url = provider.appDownloadUrl + '#name=' + title + '&icon=' + icon + '&content-type=application';
                    $('<a>').attr({'href' : url, 'download' : title})[0].click();
                    return true;
                } else {
                    return false;
                }
            });
        };

        var downloadPlayer = function(player, title, index) {
            if (player.promotType & 1) {
                var downloadAppText = '正在下载安装' + player.providerName + '...';
                var downloadVideoText = '已开始下载' + title + '...';
                var eleIndex = index !== undefined ? index : 0;
                var ele = document.getElementsByClassName('bubble-download-tips')[eleIndex];
                var cachedHtml = ele.innerHTML;
                ele.innerHTML = downloadAppText;
                ele.style.opacity = '1';
                setTimeout(function () {
                    ele.innerHTML = downloadVideoText;
                    setTimeout(function () {
                        ele.style.opacity = '0';
                        ele.innerHTML = cachedHtml;
                    }, 3000)
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

        DownloadHelper.downloadFromProvider = function (title, provider, installPlayer) {
            var url = provider.url;
            var dServiceURL = provider.accelUrl;
            if (!!installPlayer) {
                downloadPlayer(provider, title);
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
