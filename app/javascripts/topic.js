require(['config', 'utilities/ClientInfo', 'utilities/DoraemonInfo', 'GA'], function (config, ClientInfo, DoraemonInfo, GA) {
    location.href = '/404.html';
    return;

    if (window.Bugsnag) {
        Bugsnag.appVersion = DoraemonInfo.version;

        Bugsnag.metaData = {
            clientInfo: {
                version: ClientInfo.originalVersion()
            }
        };

        Bugsnag.beforeNotify = function(payload) {
            return (location.host.indexOf('127.0.0.1') < 0) && (location.pathname.indexOf('/Users/') !== 0);
        };
    }

    require(['topicMain']);
});
