(function (window) {
    define([
        '_',
        'GA',
        'utilities/DoraemonInfo'
    ], function (
        _,
        GA,
        DoraemonInfo
    ) {
        var doramon = 'video';
        var page;
        var loadTimes;
        var timeStamp;
        var query;
        var detailId = 0;
        var cachedId = [];
        var errorItems = [];
        var sentItems = [];

        var Performance = {
            initPerformance : function (p, apiCount, q) {
                page = p;
                loadTimes = apiCount;
                query = q;

                var obj = {
                    'metric' : 'loadTime',
                    'timeSpent' : performance.timing.loadEventEnd - performance.timing.navigationStart
                };

                if (!detailId) {
                    this.delaySendLog(obj, 5000);
                }
            },
            updatePerformanceQuery : function (q) {
                query = q;
            },
            setTimeStamp : function (str, id) {
                timeStamp = str;
                detailId = id;
            },
            detailOpened : function (time, id) {
                if (time && id === detailId && cachedId.indexOf(id) < 0) {
                    var obj = {
                        'metric' : 'openDetail',
                        'timeSpent' : new Date().getTime() - timeStamp
                    };

                    this.delaySendLog(obj, 500);
                    cachedId.push(id);
                }
            },
            loaded : function () {
                loadTimes--;
                if (loadTimes === 0) {
                    var obj = {
                        'metric' : 'loadComplete',
                        'timeSpent' : new Date().getTime() - performance.timing.navigationStart
                    };

                    this.delaySendLog(obj, 5000);
                }
            },
            abortTracking : function (item) {
                if (errorItems.indexOf(item) < 0) {
                    errorItems.push(item);
                }
            },
            delaySendLog : function (obj, time) {
                var o = {
                    'event' : doramon + '.performance',
                    'page' : page,
                    'metric' : obj.metric,
                    'time' : obj.timeSpent,
                    'version' : DoraemonInfo.version
                };

                if (detailId) {
                    o.id = detailId;
                }

                if (query) {
                    o.query = query;
                }

                setTimeout( function () {
                    if (errorItems.indexOf(o.metric) < 0 && sentItems.indexOf(o.metric) < 0) {
                        if (o.metric !== 'openDetail') {
                            sentItems.push(o.metric);
                        }

                        GA.log(o);
                    }
                }, time);
            }
        }

        return Performance;
    });
}(this));
