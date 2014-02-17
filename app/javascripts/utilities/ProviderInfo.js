/*global define*/
(function (window) {
    define([
        'IO',
        'Actions',
        'main/DownloadHelper',
        '_'
    ], function (
        IO,
        Actions,
        DownloadHelper,
        _
    ) {

        var providers;

        var pickProvider = function (name) {
            return _.where(providers, {title : name});
        };

        var ProviderInfo = {
            init : function () {
                if (typeof DownloadHelper.getProviders().done !== 'undefined') {
                    providers = DownloadHelper.getProviders().done(function (resp) {
                        providers = resp;
                    });
                } else {
                    providers = DownloadHelper.getProviders();
                }
            },
            pickProvider : function (name) {
                return _.where(providers, {title : name});
            },
            getObj : function (name) {
                var result = {};

                if (name) {
                    result = this.pickProvider(name)[0];
                }

                return result;
            }
        }

        return ProviderInfo;
    });
}(this));
