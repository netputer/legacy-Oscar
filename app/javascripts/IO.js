(function (window) {
    define(['Backbone'], function (Backbone) {
        var IO = {};

        // Override the sync API of Backbone.js
        if (Backbone && Backbone.sync) {
            var methodMap = {
                'create': 'POST',
                'update': 'PUT',
                'patch':  'PATCH',
                'delete': 'DELETE',
                'read':   'GET'
            };

            Backbone.sync = function (method, model, options) {
                var url = model.url;
                var params = {
                    url : model.url,
                    type : methodMap[method],
                    contentType : 'application/json',
                    data : model.data || {},
                    dataType : 'json',
                    processData : true,
                    success : options.success,
                    error : options.error,
                    xhrFields: model.xhrFields || {}
                };

                $.ajax(url, params);
            };
        }

        return IO;
    });
}(this));
