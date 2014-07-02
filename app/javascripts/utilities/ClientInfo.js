/*global define*/
(function (window) {
    define([], function () {
        var ClientInfo = {
            getVersion : function () {
                var originalVersion = navigator.userAgent.split(' ')[navigator.userAgent.split(' ').length - 1];
                var version;
                var arr = originalVersion.split('.');

                arr.forEach(function (v, index) {
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
