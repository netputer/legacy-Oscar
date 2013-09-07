/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        'IO',
        'Actions',
        'Wording',
        'catepage/CatePageRouter',
        'components/FilterView',
        'components/VideoListView',
        'components/searchbox/SearchBoxView',
        'components/PaginationView',
        'mixins/FilterNullValues'
    ], function (
        React,
        IO,
        Actions,
        Wording,
        CatePageRouter,
        FilterView,
        VideoListView,
        SearchBoxView,
        PaginationView,
        FilterNullValues
    ) {
        var catePageRouter = CatePageRouter.getInstance();

        var PAGE_SIZE = 28;

        var queryType;
        var queryCategories;
        var queryRegion;
        var queryYear;
        var queryRankType;

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

            page = page || 1;

            IO.requestAsync({
                url : Actions.actions.SEARCH,
                data : {
                    content_type : queryType,
                    rank_type : queryRankType,
                    categories : queryCategories,
                    year : queryYear,
                    region : queryRegion,
                    max : PAGE_SIZE,
                    start : page * PAGE_SIZE
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
                    list : [],
                    pageTotal : 0,
                    currentPage : 1
                };
            },
            doSearchAsync : function (page) {
                doSearchAsync(page).done(function (resp) {
                    this.setState({
                        list : this.filterNullValues(resp.videoList),
                        pageTotal : Math.round(resp.total / PAGE_SIZE),
                        currentPage : page || 1,
                    });
                }.bind(this));
            },
            componentDidMount : function () {
                catePageRouter.on('route:filter', function (cate) {
                    console.l
                    queryType = cate;

                    queryAsync(cate).done(function (resp) {
                        this.setState({
                            filters : resp
                        });
                    }.bind(this));

                    this.doSearchAsync();
                }, this);
            },
            onFilterSelect : function (prop, item) {
                switch (prop) {
                case 'years':
                    if (item === 'all') {
                        queryYear = '';
                    } else {
                        queryYear = item.begin + '-' + item.end;
                    }
                    break;
                case 'categories':
                    if (item === 'all') {
                        queryCategories = '';
                    } else {
                        queryCategories = item.name;
                    }
                    break;
                case 'areas':
                    if (item === 'all') {
                        queryRegion = '';
                    } else {
                        queryRegion = item.name;
                    }
                    break;
                case 'rank':
                    break;
                }

                doSearchAsync().done(function (resp) {
                    this.setState({
                        list : this.filterNullValues(resp.videoList)
                    });
                }.bind(this));
            },
            onVideoSelect : function (id) {
                window.location.hash = queryType + '/detail/' + id;
            },
            onSearchAction : function (query) {
                $('<a>').attr({
                    href : 'search.html#q/' + query
                })[0].click();
            },
            render : function () {
                return (
                    <div class="o-ctn">
                        <SearchBoxView
                            class="o-search-box-ctn"
                            onAction={this.onSearchAction} />
                        <FilterView
                            filters={this.state.filters}
                            onFilterSelect={this.onFilterSelect} />
                        <VideoListView title={queryType ? Wording[queryType.toUpperCase()] : ''}
                            list={this.state.list}
                            onVideoSelect={this.onVideoSelect}/>
                        <PaginationView
                            total={this.state.pageTotal}
                            current={this.state.currentPage}
                            onSelect={this.onPaginationSelect} />
                    </div>
                );
            }
        });

        return CatPage;
    });
}(this));
