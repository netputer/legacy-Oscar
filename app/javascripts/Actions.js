/*global define*/
(function (window) {
    'use strict';

    define([], function () {
        var Actions = {
            actions : {
                VIDEO_DOWNLOAD : 'wdj://video/download.json',
                BATCH_DOWNLOAD : 'wdj://video/batch_download.json',
                ACCOUNT_LOGIN : 'wdj://account/login.json',
                ACCOUNT_INFO : 'wdj://account/account_info.json',

                PERSON : 'http://persons.wandoujia.com/api/v1/persons',
                PROVIDERS : 'http://oscar.wandoujia.com/api/v1/providers',
                QUERY_SERIES : 'http://oscar.wandoujia.com/api/v1/videos/',
                QUERY_TYPE : 'http://oscar.wandoujia.com/api/v1/typeOptFields/',
                RELATIONS : 'http://oscar.wandoujia.com/api/v1/relations',
                SEARCH : 'http://oscar.wandoujia.com/api/v1/search/',
                SERIES : 'http://oscar.wandoujia.com/api/v1/videoSeries/',
                SUBSCRIBE_ADD : 'http://feed.wandoujia.com/api/v1/subscription/add',
                SUBSCRIBE_CHECK : 'http://feed.wandoujia.com/api/v1/subscription/subscribed',
                SUBSCRIBE_REMOVE : 'http://feed.wandoujia.com/api/v1/subscription/remove',
                TABS : 'http://192.168.100.47:8983/wandou-customize/api/v1/tabs/WINDOWS/VIDEO',
                TOPIC : 'http://192.168.100.47:8983/wandou-customize/api/v1/topics/',
                VERSIONS : 'http://oscar.wandoujia.com/api/v1/videoVersions/'
            },
            events : {
                ACCOUNT_STATE_CHANGE : 'account.state_changed',
            },
            enums : {
                source : 'windows'
            }
        };

        /* apply Object.freeze recursively to an object */
        var objectDeepFreeze = function (object) {
            Object.keys(object).forEach(function (key) {
                if (typeof object[key] === 'object') {
                    objectDeepFreeze(object[key]);
                }
            });
            Object.freeze(object);
            return object;
        };

        objectDeepFreeze(Actions);

        return Actions;
    });
}(this));
