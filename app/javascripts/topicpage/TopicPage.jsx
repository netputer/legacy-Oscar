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
        'main/models/VideoModel',
        'mixins/Performance',
        'mixins/FilterNullValues',
        'components/searchbox/SearchBoxView',
        'components/VideoListItemView',
        'components/FooterView'
    ], function (
        React,
        IO,
        Actions,
        Wording,
        GA,
        QueryString,
        TopicPageRouter,
        VideoModel,
        Performance,
        FilterNullValues,
        SearchBoxView,
        VideoListItemView,
        FooterView
    ) {


        var queryId = QueryString.get('id') || 0;

        var queryAsync = function (id) {
            var deferred = $.Deferred();

            IO.requestAsync({
                url : Actions.actions.TOPIC + (id || ''),
                data : {
                    pos : 'w/topicpage'
                },
                timeout : 1000 * 20,
                success : deferred.resolve,
                error : deferred.reject
            });

            return deferred.promise();
        };

        var TopicPage = React.createClass({
            mixins : [Performance],
            getInitialState : function () {
                return {
                    result : {},
                    topics : [],
                    list : []
                };
            },
            componentWillMount : function () {
                this.initPerformance('topic', 1, queryId || 'topics');
            },
            componentDidMount : function () {
                if (queryId) {
                    queryAsync(queryId).done(function (resp) {
                        var initArray = [];
                        _.each(resp.sections[0].items, function (item) {
                            initArray.push(item.content);
                        });

                        this.setState({
                            result : resp,
                            list : initArray
                        });
                        this.loaded();
                    }.bind(this));
                } else {
                    queryAsync().done(function (resp) {
                        this.setState({
                            topics : resp.reverse()
                        });
                        this.loaded();
                    }.bind(this));
                }

            },
            onSearchAction : function (query) {
                if (query.length) {
                    $('<a>').attr({
                        href : 'search.html?q=' + query
                    })[0].click();
                }
            },
            onClick : function (id) {
                if (id) {
                    $('<a>').attr({
                        href : 'topic.html?id=' + id
                    })[0].click();
                }
            },
            render : function () {
                var topic = this.state.result;

                if (this.state.list.length) {
                    var listItemViews = _.map(this.state.list, function (video) {
                            var videoModel = new VideoModel(FilterNullValues.filterNullValues.call(FilterNullValues, video))

                            return <VideoListItemView source="topic" video={videoModel} origin={video} key={video.id} onVideoSelect={this.onVideoSelect} />
                        }, this);

                    return (
                        <div className="o-ctn">
                            <SearchBoxView
                                className="o-search-box-ctn"
                                onAction={this.onSearchAction}
                                source="homepage" />
                            <div className="topic">
                                <h4>{topic.name}</h4>
                                <ul>{listItemViews}</ul>
                            </div>
                            <FooterView />
                        </div>
                    );
                } else if (this.state.topics) {
                    var topicItemView = _.map(this.state.topics, function (item) {
                        if (item.cover) {
                            var style = {
                                'background-image' : 'url(' + item.cover + ')'
                            };

                            return (
                                <li className="o-categories-item-big w-component-card o-mask"
                                    style={style}
                                    onClick={this.onClick.bind(this, item.id)} >
                                </li>
                            );
                        }
                        }, this);

                    return (
                        <div className="o-ctn">
                            <SearchBoxView
                                className="o-search-box-ctn"
                                onAction={this.onSearchAction}
                                source="homepage" />
                            <div className="topic w-wc">
                                <ul>{topicItemView}</ul>
                            </div>
                            <FooterView />
                        </div>
                    );
                }
            }
        });

        return TopicPage;
    });
}(this));
