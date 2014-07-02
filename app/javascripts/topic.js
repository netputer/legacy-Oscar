require(['config', 'utilities/ClientInfo', 'utilities/DoraemonInfo', 'GA'], function (config, ClientInfo, DoraemonInfo, GA) {
    Bugsnag.appVersion = DoraemonInfo.version;

    Bugsnag.metaData = {
        clientInfo: {
            version: ClientInfo.originalVersion()
        }
    };

    require(['topicMain']);
});
