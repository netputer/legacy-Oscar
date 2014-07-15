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
            queryEpisodesAsync : function (id, start, max) {
                var deferred = $.Deferred();

                var data = {
                    opt_fields : 'videoEpisodes.*'
                };

                if (start !== undefined) {
                    data.estart = start;
                }

                if (max) {
                    data.emax = max;
                    data.order = 0;
                }


                IO.requestAsync({
                    url : Actions.actions.QUERY_SERIES + id,
                    data : data,
                    success : deferred.resolve,
                    error : deferred.reject
                });

                return deferred.promise();
            },
            queryPersonAsync : function (arg) {
                var deferred = $.Deferred();

                IO.requestAsync({
                    url : Actions.actions.PERSON + (typeof arg === 'number' ? '?ids=' + arg : '?names=' + arg),
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
                        person : name,
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
