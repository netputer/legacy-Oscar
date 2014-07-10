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

                SEARCH : 'http://oscar.wandoujia.com/api/v1/search/',
                QUERY_TYPE : 'http://oscar.wandoujia.com/api/v1/typeOptFields/',
                QUERY_SERIES : 'http://oscar.wandoujia.com/api/v1/videos/',

                TOPIC : 'http://oscar.wandoujia.com/api/v1/topics',
                PERSON : 'http://10.0.25.46:8080/persons/api/v1/personProducts/',
                PROVIDERS : 'http://oscar.wandoujia.com/api/v1/providers'
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
