(function (window) {
    define([
        '_',
        '$R',
        'GA',
        'utilities/DoraemonInfo'
    ], function (
        _,
        $R,
        GA,
        DoraemonInfo
    ) {

        var content_type = 'VIDEO';

        var Log = {};

        Log.consume = function (consumption, resource) {
            var info = {
                event : 'content.multimedia.consumption',

                content_type : content_type,
                consumption_type : consumption.type,

                resource_type : 'wdj_hosted',
                resource_id : resource.id,
                resource_episode_id : resource.video_id,

                open_type : consumption.type === 'online_play' ? 'system' : 'wdj',

                consumption_source : consumption.source,

                url : '/' + content_type.toLowerCase() + location.pathname + location.search + location.hash,
                url_normalize : '/' + content_type.toLowerCase() + location.pathname + (location.search.indexOf('=') >= 0 ? location.search.split('=')[0] + '=' : location.search)
            }

            GA.log(info);
        }

        return Log;
    });
}(this));
