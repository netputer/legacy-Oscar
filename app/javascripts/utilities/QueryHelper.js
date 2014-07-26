(function (window) {
    define([
        'IO',
        'Actions'
    ], function (
        IO,
        Actions
    ) {

        var QueryHelper = {
            queryAsync : function (id) {
                var deferred = $.Deferred();

                IO.requestAsync({
                    url : Actions.actions.QUERY_SERIES + id,
                    data : {
                        opt_fields : [
                            'title',
                            'type',
                            'id',
                            'alias',
                            'description',
                            'actors.*',
                            'cover.*',
                            'categories.name',
                            'latestEpisodeNum',
                            'latestEpisodeDate',
                            'totalEpisodesNum',
                            'marketRatings.rating',
                            'marketComments.*',
                            'categories.*',
                            'pictures.s',
                            'providerNames.*',
                            'recommend',
                            'releaseDate',
                            'subscribeUrl',
                            'videoSeries_id',
                            'year',
                            'presenters'
                        ].join(',')
                    },
                    success : deferred.resolve,
                    error : deferred.reject
                });

                return deferred.promise();
            },
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
            queryEpisodesAsync : function (id, start, max, order) {
                var deferred = $.Deferred();

                var data = {
                    opt_fields : 'videoEpisodes.*'
                };

                if (start !== undefined) {
                    data.estart = start;
                }

                if (max) {
                    data.emax = max;
                }

                if (order) {
                    data.order = order;
                }

                IO.requestAsync({
                    url : Actions.actions.QUERY_SERIES + id,
                    data : data,
                    success : deferred.resolve,
                    error : deferred.reject
                });

                return deferred.promise();
            },
            queryPersonAsync : function (arg, opt_fields) {
                var deferred = $.Deferred();

                var person;

                var data = {};

                if (typeof arg === 'array') {
                    person = typeof arg[0] === 'number' ? '?ids=' + arg.join(',') : '?names=' + arg.join(',')
                } else {
                    person = typeof arg === 'number' ? '?ids=' + arg : '?names=' + arg
                }

                if (opt_fields) {
                    data['opt_fields'] =  opt_fields;
                }

                IO.requestAsync({
                    url : Actions.actions.PERSON + person,
                    data : data,
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
