/*global define*/
(function (window) {
    define(['_'], function (_) {
        var ClientInfo = {
            getVersion : function () {
                var originalVersion = navigator.userAgent.split(' ')[navigator.userAgent.split(' ').length - 1];
                var version;
                var arr = originalVersion.split('.');
                _.each(arr, function (v, index) {
                    if (index === 0) {
                        version = v + '.';
                    } else {
                        version += v;
                    }
                });

                return parseFloat(version);
            },
            originalVersion : function () {
                var originalVersion = navigator.userAgent.split(' ')[navigator.userAgent.split(' ').length - 1];
                return originalVersion;
            }
        };

        return ClientInfo;
    });
}(this));
