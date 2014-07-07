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

        var vertical = 'VIDEO';


        var Log = {};


        Log.consume = function (consumption, resource) {
            var info = {
                event : 'content.multimedia.consumption',

                content_type : vertical,
                consumption_type : consumption.type,

                resource_type : 'wdj_hosted',
                resource_provider_name : resource.providerName,
                resource_id : resource.id,
                resource_episode_id : resource.video_id,

                open_type : consumption.type === 'online_play' ? 'system' : 'wdj',

                consumption_source : consumption.source,

                url : '/' + vertical.toLowerCase() + location.pathname + location.search + location.hash,
                url_normalize : '/' + vertical.toLowerCase() + location.pathname + (location.search.indexOf('=') >= 0 ? location.search.split('=')[0] + '=' : location.search)
            }
            GA.log(info);
        }

        return Log;
    });
}(this));
