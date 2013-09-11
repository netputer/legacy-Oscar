/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        'IO',
        'Actions',
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
                    content_type : queryType
                },
                success : deferred.resolve,
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
            mixins : [FilterNullValues],
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
                }.bind(this));

                return deferred.promise();
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
                    }.bind(this));

                    this.queryAsync(query, this.state.currentPage);
                }, this);
            },
            onSearchAction : function (keyword) {
                searchPageRouter.navigate('q/' + keyword, {
                    trigger : true
                });
            },
            onPaginationSelect : function (target) {
                this.queryAsync(this.state.query, target).done(function () {
                    this.refs['video-ctn'].getDOMNode().scrollIntoView();
                }.bind(this));
            },
            onVideoSelect : function (video) {
                searchPageRouter.navigate('#q/' + searchPageRouter.getQuery() + '/detail/' + video.id, {
                    trigger : true
                });
            },
            onFilterSelect : function (prop, item) {
                switch (prop) {
                case 'years':
                    if (!item) {
                        queryYear = '';
                    } else {
                        if (typeof item === 'string') {
                            queryYear = '';
                        } else {
                            queryYear = item.begin + '-' + item.end;
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
                        years : queryYear,
                        rank : queryRankType,
                        currentPage : 1,
                        pageTotal : 0
                    }
                });

                this.queryAsync(this.state.query);
            },
            render : function () {
                return (
                    <div class="o-ctn">
                        <SearchBoxView
                            class="o-search-box-ctn"
                            onAction={this.onSearchAction}
                            keyword={this.state.keyword} />
                        <FilterView
                            filters={this.state.filters}
                            onFilterSelect={this.onFilterSelect}
                            filterSelected={this.state.filterSelected} />
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
