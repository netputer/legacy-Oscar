/*global define, console*/
(function (window) {
    define([
        '_',
        'IO',
        'utilities/FilterFunction'
    ], function (
        _,
        IO,
        FilterFunction
    ) {
        console.log('IOBackendDevice - File loded.');

        IO.Backend.Device = _.extend({}, IO.Backend);

        IO.Backend.Device.onmessage = function (route, callback, listenToAllDevices, context) {

            if (typeof listenToAllDevices !== 'boolean') {
                context = listenToAllDevices;
                listenToAllDevices = false;
            }

            return IO.Backend.onmessage(route, callback, context);
        };

        window.IO = IO;

        return IO;
    });
}(this));
