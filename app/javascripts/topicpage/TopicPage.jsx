/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        'IO',
        'Actions',
        'Wording',
        'GA',
        'utilities/QueryString',
        'topicpage/TopicPageRouter',
        'mixins/FilterNullValues',
        'components/searchbox/SearchBoxView',
        'components/VideoListItemView',
        'topicpage/collections/TopicResultCollection',
        'components/FooterView'
    ], function (
        React,
        IO,
        Actions,
        Wording,
        GA,
        QueryString,
        TopicPageRouter,
        FilterNullValues,
        SearchBoxView,
        VideoListItemView,
        TopicResultCollection,
        FooterView
    ) {

        var topicPageRouter = TopicPageRouter.getInstance();

        var topicName;

        var topicCnName = '';

        var queryType = QueryString.get('type') || '';

        var queryAsync = function (name, type) {
            var deferred = $.Deferred();

            IO.requestAsync({
                url : type !== undefined ? Actions.actions.TOPIC + '?type=' + type + '&name=' + name : Actions.actions.TOPIC + '/' + name,
                data : {
                    pos : 'w/topicpage'
                },
                timeout : 1000 * 20,
                success : deferred.resolve,
                error : deferred.reject
            });

            return deferred.promise();
        };

        var topicResultCollection = new TopicResultCollection();


        var TopicPage = React.createClass({
            getInitialState : function () {
                return {
                    list : []
                };
            },
            componentDidMount : function () {
                // var start = performance.timing.navigationStart;

                topicPageRouter.on('route:topic', function (topic) {
                    topicName = topic;

                    queryAsync(topic, queryType).done(function (resp) {
                        if (resp.length) {
                            topicCnName = resp[0].cnName;
                        }
                    });

                    queryAsync(topic).done(function (resp) {
                        topicResultCollection.reset(resp);

                        this.setState({
                            list : topicResultCollection.models
                        });
                    }.bind(this));

                }, this);

            },
            onSearchAction : function (query) {
                if (query.length) {
                    $('<a>').attr({
                        href : 'search.html#q/' + query
                    })[0].click();
                }
            },
            onVideoSelect : function (video) {
                if (topicName !== undefined) {
                    window.location.hash = '#' + topicName + '/detail/' + video.id;
                    GA.log({
                        'event' : 'video.download.action',
                        'action' : 'btn_click',
                        'pos' : 'topic',
                        'video_id' : video.id,
                        'video_title' : video.title,
                        'video_type' : video.type,
                        'video_category' : video.categories,
                        'video_year' : video.year,
                        'video_area' : video.region
                    });

                }
            },
            clickBanner : function (cate, query) {
                $('<a>').attr({
                    href : 'cate.html?' + query + '#' + cate
                })[0].click();
            },
            render : function () {
                    var listItemViews = _.map(this.state.list, function (video) {
                        return <VideoListItemView source="topic" video={video} key={video.id} onVideoSelect={this.onVideoSelect} />
                    }, this);
                return (
                    <div className="o-ctn">
                        <SearchBoxView
                            className="o-search-box-ctn"
                            onAction={this.onSearchAction}
                            source="homepage" />
                        <div class="topic">
                            <h5>{Wording[queryType.toUpperCase()]}</h5>
                            <h4>{topicCnName}</h4>
                            <ul>{listItemViews}</ul>
                        </div>
                        <FooterView />
                    </div>
                );
            }
        });

        return TopicPage;
    });
}(this));
