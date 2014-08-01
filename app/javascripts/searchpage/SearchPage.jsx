/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        'IO',
        'Actions',
        'Wording',
        'main/Log',
        'mixins/Performance',
        'mixins/FilterNullValues',
        'utilities/QueryString',
        'utilities/QueryHelper',
        'components/searchbox/SearchBoxView',
        'components/PersonView',
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
        Log,
        Performance,
        FilterNullValues,
        QueryString,
        QueryHelper,
        SearchBoxView,
        PersonView,
        SearchResultView,
        PaginationView,
        FilterView,
        SearchPageRouter,
        SearchResultCollection,
        FooterView
    ) {
        var PAGE_SIZE = 10;

        var keyword = QueryString.get('q') || '';
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
                        'categories.*',
                        'pictures.s',
                        'year',
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

        var searchResultCollection = new SearchResultCollection();

        var SearchPage = React.createClass({
            mixins : [FilterNullValues, Performance],
            getInitialState : function () {
                return {
                    origin : [],
                    result : [],
                    person :[],
                    loading : false,
                    currentPage : 1,
                    pageTotal : 0,
                    query : keyword,
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
                };
            },
            queryAsync : function (query, page) {
                var deferred = $.Deferred();

                queryAsync(query, page).done(function (resp) {
                    resp = this.filterNullValues(resp);
                    resp.total = resp.total > 200 ? 200 : resp.total;
                    searchResultCollection.reset(resp.videoList);
                    this.setState({
                        result : searchResultCollection.models,
                        origin : resp.videoList,
                        loading : false,
                        pageTotal : Math.ceil(resp.total / PAGE_SIZE),
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

                if (page === 1) {
                    QueryHelper.queryPersonAsync(query, 'name,coverUrl,jobs,productCount.*,introduction,id,instroduction,albumsUrls').done(function (res) {
                        this.setState({
                            person : res
                        });
                        this.loaded();
                    }.bind(this));
                }

                return deferred.promise();
            },
            componentWillMount : function () {
                this.initPerformance('search', 3, keyword);

                searchPageRouter.on('route:compate', function (key) {
                    if (key) {
                        keyword = key;

                        history.pushState(null, null, '?q=' + keyword);

                        $('.o-search-box-input').val(keyword);

                        this.setState({
                            query : keyword
                        });

                        QueryHelper.queryTypeAsync('tv').done(function (resp) {
                            delete resp.categories;
                            this.setState({
                                filters : resp
                            });
                            this.loaded();
                        }.bind(this)).fail( function () {
                            this.abortTracking('loadComplete');
                        }.bind(this));

                        this.queryAsync(keyword, this.state.currentPage);
                    }
                }.bind(this));

            },
            componentDidMount : function () {
                if (keyword) {
                    QueryHelper.queryTypeAsync('tv').done(function (resp) {
                        delete resp.categories;
                        this.setState({
                            filters : resp
                        });
                        this.loaded();
                    }.bind(this)).fail( function () {
                        this.abortTracking('loadComplete');
                    }.bind(this));

                    this.queryAsync(keyword, this.state.currentPage);
                }
            },
            onSearchAction : function (keyword) {
                if (keyword.length) {
                    history.pushState(null, null, '?q=' + keyword);
                    this.queryAsync(keyword, this.state.currentPage);

                    QueryHelper.queryPersonAsync(keyword).done(function (res) {
                        this.setState({
                            person : res
                        });
                    }.bind(this));

                    Log.updateUrl();
                    Log.pageShow();
                }
            },
            onPaginationSelect : function (target) {
                this.queryAsync(this.state.query, target).done(function () {
                    this.refs['video-ctn'].getDOMNode().scrollIntoView();
                }.bind(this));
            },
            onVideoSelect : function (video) {
                this.setTimeStamp(new Date().getTime(), video.id);
                window.location.hash = '#detail/' + video.id;
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
                        currentPage : this.state.currentPage,
                        pageTotal : 0
                    }
                });

                this.queryAsync(this.state.query);
            },
            getCounts : function () {
                var filters = this.state.filterSelected;
                if (!filters.type && !filters.areas && !filters.years && filters.rank === 'rel') {
                    return this.state.total + this.state.person.length;
                } else {
                    return this.state.total
                }
            },
            render : function () {
                return (
                    <div className="o-ctn">
                        <SearchBoxView
                            className="o-search-box-ctn"
                            onAction={this.onSearchAction}
                            keyword={this.state.query}
                            source="search" />
                        <FilterView
                            filters={this.state.filters}
                            onFilterSelect={this.onFilterSelect}
                            filterSelected={this.state.filterSelected}
                            source="search" />
                        <div className="summary h5 w-text-info">共 {this.getCounts()} 条搜索结果</div>
                        <PersonView
                            persons={this.state.person}
                            filterSelected={this.state.filterSelected}
                            current={this.state.currentPage}
                            loaded={this.state.loaded} />
                        <SearchResultView
                            keyword={this.state.query}
                            origin={this.state.origin}
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
