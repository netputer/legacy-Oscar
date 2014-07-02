define(['config', 'utilities/ClientInfo', 'GA'], function (config, ClientInfo, GA) {
    Bugsnag.metaData = {
        clientInfo: {
            version: ClientInfo.originalVersion()
        }
    };

    require(['cateMain']);


});
