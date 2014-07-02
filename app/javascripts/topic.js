define(['config', 'utilities/ClientInfo', 'utilities/DoraemonInfo', 'GA'], function (config, ClientInfo, DoraemonInfo, GA) {
    Bugsnag.appVersion = DoraemonInfo.version;

    Bugsnag.metaData = {
        clientInfo: {
            version: ClientInfo.originalVersion()
        }
    };

    Bugsnag.beforeNotify = function(payload) {
        return location.host.indexOf('127.0.0.1') < 0;
    }

    require(['topicMain']);
});
