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
                    deferred.resolve(JSON.parse(data));
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
            },
            queryEpisodesAsync : function (id) {
                var deferred = $.Deferred();

                IO.requestAsync({
                    url : Actions.actions.QUERY_SERIES + id,
                    data : {
                        opt_fields : 'videoEpisodes.*'
                    },
                    success : deferred.resolve,
                    error : deferred.reject
                });

                return deferred.promise();
            },
            queryPersonAsync : function (arg) {
                var deferred = $.Deferred();

                IO.requestAsync({
                    url : Actions.actions.PERSON + (typeof arg === 'number' ? arg : 'name?name=' + arg),
                    success : deferred.resolve,
                    error : deferred.reject
                });

                return deferred.promise();
            },
            queryWorksAsync : function (name, start, max) {
                var deferred = $.Deferred()

                IO.requestAsync({
                    url : Actions.actions.SEARCH,
                    data : {
                        actor : name,
                        start : start,
                        max : max,
                        opt_fields : [
                            'title',
                            'type',
                            'id',
                            'actors',
                            'cover.l',
                            'latestEpisodeNum',
                            'latestEpisodeDate',
                            'totalEpisodesNum',
                            'marketRatings.rating'
                        ].join(',')
                    },
                    success : deferred.resolve,
                    error : deferred.reject
                });

                return deferred.promise();
            }
        };

        return QueryHelper;
    });
}(this));
