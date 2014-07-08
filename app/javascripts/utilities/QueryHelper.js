(function (window) {
    define([
        'IO',
        'Actions'
    ], function (
        IO,
        Actions
    ) {

        var QueryHelper = {

            queryTypeAsync : function (type) {
                var deferred = $.Deferred();
                var data = sessionStorage.getItem(type);

                if (data) {
                    setTimeout(function () {
                        deferred.resolve(JSON.parse(data));
                    }, 0);
                } else {
                    IO.requestAsync({
                        url : Actions.actions.QUERY_TYPE,
                        data : {
                            type : type
                        },
                        success : function (data) {
                            deferred.resolve(data);
                            sessionStorage.setItem(type, JSON.stringify(data));
                        },
                        error : deferred.reject
                    });
                }

                return deferred.promise();
            }
        };

        return QueryHelper;
    });
}(this));
