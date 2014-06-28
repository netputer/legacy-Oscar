/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        'IO',
        'Actions',
        'Wording',
        'mixins/Performance',
        'mixins/FilterNullValues',
        'utilities/QueryString',
        'components/searchbox/SearchBoxView',
        'components/SearchResultView',
        'components/PaginationView',
        'components/FilterView',
        'searchpage/SearchPageRouter',
        'searchpage/collections/SearchResultCollection',
        'components/FooterView'
    ], function (
        React,
        IO,
        Actions,
        Wording,
        Performance,
        FilterNullValues,
        QueryString,
        SearchBoxView,
        SearchResultView,
        PaginationView,
        FilterView,
        SearchPageRouter,
        SearchResultCollection,
        FooterView
    ) {
        var PAGE_SIZE = 10;

        var queryType;
        var queryRegion = QueryString.get('areas') || '';
        var queryYear = QueryString.get('year') || '';
        var queryYearText;
        var queryRankType = 'rel';

        var searchPageRouter = SearchPageRouter.getInstance();

        var queryAsync = function (keyword, page) {
            var deferred = $.Deferred();

            page = Math.max((page || 0) - 1, 0);

            IO.requestAsync({
                url : Actions.actions.SEARCH + keyword,
                data : {
                    start : page * PAGE_SIZE,
                    max : PAGE_SIZE,
                    pos : 'w/searchpage',
                    rank_type : queryRankType,
                    year : queryYear,
                    region : queryRegion,
                    content_type : queryType,
                    opt_fields : [
                        'title',
                        'type',
                        'id',
                        'actors.*',
                        'cover.l',
                        'categories.name',
                        'latestEpisodeNum',
                        'latestEpisodeDate',
                        'totalEpisodesNum',
                        'marketRatings.rating',
                        'videoEpisodes',
                        'categories.*',
                        'pictures.*',
                        'year',
                        'videoEpisodes.downloadUrls.*',
                        'videoEpisodes.playInfo.*',
                        'presenters'
                    ].join(',')
                },
                success : function (resp) {
                    window.sessionId = resp.sessionId;
                    deferred.resolve(resp);
                },
                error : deferred.reject
            });

            return deferred.promise();
        };

        var queryTypeAsync = function (type) {
            var deferred = $.Deferred();

            IO.requestAsync({
                url : Actions.actions.QUERY_TYPE,
                data : {
                    type : type
                },
                success : deferred.resolve,
                error : deferred.reject
            });

            return deferred.promise();
        };

        var searchResultCollection = new SearchResultCollection();

        var SearchPage = React.createClass({
            mixins : [FilterNullValues, Performance],
            getInitialState : function () {
                return {
                    keyword : searchPageRouter.getQuery(),
                    result : [],
                    loading : false,
                    currentPage : 1,
                    pageTotal : 0,
                    currentPage : 1,
                    query : '',
                    total : 0,
                    correctQuery : '',
                    filterSelected : {
                        type : queryType,
                        areas : '',
                        years : '',
                        rank : queryRankType
                    },
                    filters : {},
                    loaded : false
                }
            },
            queryAsync : function (query, page) {
                var deferred = $.Deferred();

                queryAsync(query, page).done(function (resp) {
                    resp = this.filterNullValues(resp);
                    resp.total = resp.total > 200 ? 200 : resp.total;
                    searchResultCollection.reset(resp.videoList);
                    this.setState({
                        result : searchResultCollection.models,
                        loading : false,
                        pageTotal : Math.round(resp.total / PAGE_SIZE),
                        currentPage : page || 1,
                        query : query,
                        total : resp.total,
                        correctQuery : resp.correctQuery,
                        loaded : true
                    }, function () {
                        deferred.resolve();
                    });

                    this.loaded();
                }.bind(this)).fail( function () {
                    this.abortTracking('loadComplete');
                }.bind(this));

                return deferred.promise();
            },
            componentWillMount : function () {
                searchPageRouter.on('route:search', function (query) {
                    this.initPerformance('search', 3, query);
                }, this);
            },
            componentDidMount : function () {
                searchPageRouter.on('route:search', function (query) {
                    this.setState({
                        keyword : query || '',
                        loading : true,
                        query : query
                    });

                    queryTypeAsync('tv').done(function (resp) {
                        delete resp.categories;
                        this.setState({
                            filters : resp
                        });
                        this.loaded();
                    }.bind(this)).fail( function () {
                        this.abortTracking('loadComplete');
                    }.bind(this));

                    this.queryAsync(query, this.state.currentPage);
                }, this);
            },
            onSearchAction : function (keyword) {
                if (keyword.length) {
                    searchPageRouter.navigate('q/' + keyword, {
                        trigger : true
                    });
                }
            },
            onPaginationSelect : function (target) {
                this.queryAsync(this.state.query, target).done(function () {
                    this.refs['video-ctn'].getDOMNode().scrollIntoView();
                }.bind(this));
            },
            onVideoSelect : function (video) {
                this.setTimeStamp(new Date().getTime(), video.id);
                searchPageRouter.navigate('#q/' + searchPageRouter.getQuery() + '/detail/' + video.id, {
                    trigger : true
                });
            },
            onFilterSelect : function (prop, item) {
                switch (prop) {
                case 'years':
                    if (!item) {
                        queryYear = '';
                        queryYearText = '';
                    } else if (typeof item === 'string') {
                            queryYear = '';
                            queryYearText = '';
                    } else {
                        queryYearText = item.name;
                        if (item.name !== undefined && item.name.indexOf(Wording.TIME) > 0) {
                            queryYear = item.begin + '-' + item.end;
                        } else {
                            queryYear = item.name;
                        }
                    }
                    break;
                case 'type':
                    queryType = item.type;
                    break;
                case 'areas':
                    if (!item) {
                        queryRegion = '';
                    } else {
                        queryRegion = item.name;
                    }
                    break;
                case 'rank':
                    queryRankType = item.type;
                    break;
                }

                this.setState({
                    filterSelected : {
                        type : queryType,
                        areas : queryRegion,
                        years : queryYearText,
                        rank : queryRankType,
                        currentPage : 1,
                        pageTotal : 0
                    }
                });

                this.queryAsync(this.state.query);
            },
            render : function () {
                return (
                    <div className="o-ctn">
                        <SearchBoxView
                            className="o-search-box-ctn"
                            onAction={this.onSearchAction}
                            keyword={this.state.keyword}
                            source="search" />
                        <FilterView
                            filters={this.state.filters}
                            onFilterSelect={this.onFilterSelect}
                            filterSelected={this.state.filterSelected}
                            source="search" />
                        <SearchResultView
                            keyword={this.state.keyword}
                            list={this.state.result}
                            loading={this.state.loading}
                            total={this.state.total}
                            correctQuery={this.state.correctQuery}
                            onVideoSelect={this.onVideoSelect}
                            loaded={this.state.loaded}
                            ref="video-ctn" />
                        <PaginationView
                            total={this.state.pageTotal}
                            current={this.state.currentPage}
                            onSelect={this.onPaginationSelect} />
                        <FooterView />
                    </div>
                );
            }
        });

        return SearchPage;
    });
}(this));
