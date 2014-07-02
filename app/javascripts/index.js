define(['config', 'utilities/ClientInfo', 'GA'], function (config, ClientInfo, GA) {
    Bugsnag.metaData = {
        clientInfo: {
            version: ClientInfo.originalVersion()
        }
    };

    require(['indexMain']);

    GA.log({
        'event' : 'video.common.action',
        'action' : 'tab_view',
        'type' : 'homepage'
    });
});
