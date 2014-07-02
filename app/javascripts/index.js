require(['config', 'utilities/ClientInfo', 'utilities/DoraemonInfo', 'GA'], function (config, ClientInfo, DoraemonInfo, GA) {
    Bugsnag.appVersion = DoraemonInfo.version;

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
