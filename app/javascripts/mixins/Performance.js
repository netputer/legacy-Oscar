/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        '_',
        'GA'
    ], function (
        _,
        GA
    ) {
        var doramon = 'video';
        var page;
        var loadTimes;
        var timeStamp;
        var query;
        var detailId = 0;
        var cachedId = [];

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
            shouldComponentUpdate: function(nextProps, nextState) {
                if (nextState.subscribed !== -2 && nextState.subscribed !== this.state.subscribed && timeStamp) {
                    var obj = {
                        'metric' : 'openDetail',
                        'timeSpent' : new Date().getTime() - timeStamp
                    };

                    if (cachedId.indexOf(detailId) < 0) {
                        this.delaySendLog(obj, 500);
                        cachedId.push(detailId);
                    }
                }
                return !(nextState === this.state);
            },
            setTimeStamp : function (str, id) {
                timeStamp = str;
                detailId = id;
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
            delaySendLog : function (obj, time) {
                var o = {
                    'event' : doramon + '.performance',
                    'page' : page,
                    'metric' : obj.metric,
                    'time' : obj.timeSpent
                };

                if (detailId) {
                    o.id = detailId;
                }

                if (query) {
                    o.query = query;
                }

                setTimeout( function () {
                    GA.log(o);
                }, time);
            }
        }

        return Performance;
    });
}(this));
