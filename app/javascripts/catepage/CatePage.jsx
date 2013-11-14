/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        'IO',
        'Actions',
        'Wording',
        'utilities/QueryString',
        'catepage/CatePageRouter',
        'components/FilterView',
        'components/VideoListView',
        'components/searchbox/SearchBoxView',
        'components/PaginationView',
        'mixins/FilterNullValues',
        'components/FooterView',
        'components/LoadingView'
    ], function (
        React,
        IO,
        Actions,
        Wording,
        QueryString,
        CatePageRouter,
        FilterView,
        VideoListView,
        SearchBoxView,
        PaginationView,
        FilterNullValues,
        FooterView,
        LoadingView
    ) {
        var catePageRouter = CatePageRouter.getInstance();

        var PAGE_SIZE = 28;

        var queryType;
        var queryCategories = QueryString.get('categories') || '';
        var queryRegion = QueryString.get('areas') || '';
        var queryYear = QueryString.get('year') || '';
        var queryYearText;
        var queryRankType = 'hot';

        var resetParams = function () {
            queryCategories = QueryString.get('categories') || '';
            queryRegion = QueryString.get('areas') || '';
            queryYear = QueryString.get('year') || '';
            queryRankType = 'hot';
        };

        var queryAsync = function (type) {
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

        var doSearchAsync = function (page) {
            var deferred = $.Deferred();

            page = Math.max((page || 0) - 1, 0);

            IO.requestAsync({
                url : Actions.actions.SEARCH,
                data : {
                    content_type : queryType,
                    rank_type : queryRankType,
                    categories : queryCategories,
                    year : queryYear,
                    region : queryRegion,
                    max : PAGE_SIZE,
                    start : page * PAGE_SIZE,
                    pos : 'w/catepage',
                },
                success : deferred.resolve,
                error : deferred.reject
            });

            return deferred.promise();
        };

        var CatPage = React.createClass({
            mixins : [FilterNullValues],
            getInitialState : function () {
                return {
                    filters : {},
                    filterSelected : {
                        categories : queryCategories,
                        areas : queryRegion,
                        years : queryYear,
                        rank : queryRankType
                    },
                    list : [],
                    pageTotal : 0,
                    currentPage : 1,
                    loaded : false
                };
            },
            doSearchAsync : function (page) {
                var deferred = $.Deferred();

                this.setState({
                    loading : true
                });
                doSearchAsync(page).done(function (resp) {
                    resp.total = resp.total > 200 ? 200 : resp.total;
                    this.setState({
                        list : this.filterNullValues(resp.videoList),
                        pageTotal : Math.round(resp.total / PAGE_SIZE),
                        currentPage : page || 1,
                        loading : false,
                        loaded : true
                    }, function () {
                        deferred.resolve();
                    });
                }.bind(this));

                return deferred.promise();
            },
            componentDidMount : function () {
                catePageRouter.on('route:filter', function (cate) {
                    queryType = cate;

                    queryAsync(cate).done(function (resp) {
                        this.setState({
                            filters : resp
                        });
                    }.bind(this));

                    this.doSearchAsync(this.state.currentPage);
                }, this);
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
                case 'categories':
                    if (!item) {
                        queryCategories = '';
                    } else {
                        queryCategories = item.name;
                    }
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
                        currentPage : 1,
                        pageTotal : 0,
                        categories : queryCategories,
                        areas : queryRegion,
                        years : queryYearText,
                        rank : queryRankType
                    }
                });

                this.doSearchAsync();
            },
            onVideoSelect : function (id) {
                window.location.hash = queryType + '/detail/' + id;
            },
            onSearchAction : function (query) {
                if (query.length) {
                    $('<a>').attr({
                        href : 'search.html#q/' + query
                    })[0].click();
                }
            },
            onPaginationSelect : function (page) {
                this.doSearchAsync(page).done(function () {
                    this.refs['video-ctn'].getDOMNode().scrollIntoView();
                }.bind(this));
            },
            render : function () {
                var loadingView = this.state.loading ? <LoadingView fixed="true" /> : '';
                return (
                    <div className="o-ctn">
                        <SearchBoxView
                            className="o-search-box-ctn"
                            onAction={this.onSearchAction}
                            source={queryType} />
                        <h4>{queryType && Wording[queryType.toUpperCase()]}</h4>
                        <FilterView
                            filters={this.state.filters}
                            onFilterSelect={this.onFilterSelect}
                            filterSelected={this.state.filterSelected}
                            source={queryType} />
                        <VideoListView title=""
                            list={this.state.list}
                            onVideoSelect={this.onVideoSelect}
                            loaded={this.state.loaded}
                            ref="video-ctn" />
                        <PaginationView
                            total={this.state.pageTotal}
                            current={this.state.currentPage}
                            onSelect={this.onPaginationSelect} />
                        {loadingView}
                        <FooterView />
                    </div>
                );
            }
        });

        return CatPage;
    });
}(this));
