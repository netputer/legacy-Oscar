(function (window) {
    define([
        '_',
        'GA',
        'utilities/DoraemonInfo'
    ], function (
        _,
        GA,
        DoraemonInfo
    ) {

        var Log = {};

        var vertical = 'VIDEO';

        var cacheInfo = {};

        var collection = {
            getUrl : function () {
                if (location.href.indexOf('detail/') > 0) {
                    return '/' + vertical.toLowerCase() + '?id=' + location.href.split('detail/')[1];
                } else {
                    return '/' + vertical.toLowerCase() + location.pathname + location.search + location.hash;
                }
            },
            getUrlNormalize : function () {
                if (location.href.indexOf('detail/') > 0) {
                    return '/' + vertical.toLowerCase() + '?id=';
                } else {
                    return '/' + vertical.toLowerCase() + location.pathname + (location.search.indexOf('=') >= 0 ? location.search.split('=')[0] + '=' : location.search);
                }
            }
        }


        var packages = {
            url : {
                url : collection.getUrl(),
                url_normalize : collection.getUrlNormalize(),
                vertical : vertical
            },
            click : {
                module : '',
                element : '',
                name : '',
                index : 0
            },
            content : {
                content_type : vertical,
                content_id : 0,
                content_episode_id : 0,
                content_package_name : ''
            },
            refer : {
                refer_url : '',
                refer_url_normalize : '',
                refer_module : '',
                refer_element : '',
                refer_name : '',
                refer_index : ''
            },
            from : {
                from_url : '',
                from_url_normalize : '',
                from_module : '',
                from_element : '',
                from_name : '',
                from_index : 0
            },
            resource : {
                resource_type : 'wdj_hosted',
                resource_provider_name : '',
                resource_id : 0,
                resource_episode_id : 0
            },
            updateUrl : function () {
                this.refer = {
                    refer_url : this.url.url,
                    refer_url_normalize : this.url.url_normalize
                };
                this.url = {
                    url : collection.getUrl(),
                    url_normalize : collection.getUrlNormalize(),
                    vertical : vertical
                };
            },
            get : function (arr) {
                var obj = {};
                _.each(arr, function (name) {
                    for (var key in packages[name]) {
                        obj[key] = packages[name][key]
                    }
                });

                return obj;
            }
        };


        window.addEventListener('hashchange', function () {
            packages.updateUrl();
        });


        Log.updateUrl = function () {
            packages.updateUrl();
        };

        Log.pageShow = function () {
            var info = packages.get(['url', 'refer']);
            var result = {};

            for (var key in info) {
                if (key) {
                    result[key] = info[key];
                }
            }

            GA.log(result);
        };


        Log.consume = function (consumption, resource) {
            var info = packages.get(['url', 'resource']);

            info = {
                event : 'content.multimedia.consumption',
                consumption_source : consumption.source,
                consumption_type : consumption.type,
                open_type : consumption.type === 'online_play' ? 'system' : 'wdj',
                resource_episode_id : resource.video_id,
                resource_id : resource.id,
                resource_provider_name : resource.providerName
            }

            GA.log(info);
        }

        return Log;
    });
}(this));
