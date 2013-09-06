/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        'IO',
        'Actions',
        'mixins/FilterNullValues',
        'components/searchbox/SearchBoxView',
        'components/SearchResultView',
        'components/PaginationView',
        'searchpage/SearchPageRouter',
        'searchpage/collections/SearchResultCollection'
    ], function (
        React,
        IO,
        Actions,
        FilterNullValues,
        SearchBoxView,
        SearchResultView,
        PaginationView,
        SearchPageRouter,
        SearchResultCollection
    ) {
        var PAGE_SIZE = 10;

        var searchPageRouter = new SearchPageRouter();

        var queryAsync = function (keyword, page) {
            var deferred = $.Deferred();

            page = Math.max((page || 0) - 1, 0);

            IO.requestAsync({
                url : Actions.actions.SEARCH + keyword,
                data : {
                    start : page * PAGE_SIZE,
                    max : PAGE_SIZE,
                    pos : 'w/searchpage'
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
                    correctQuery : ''
                }
            },
            queryAsync : function (query, page) {
                queryAsync(query, page).done(function (resp) {
                    resp = this.filterNullVlaues(resp);
                    searchResultCollection.reset(resp.videoList);
                    this.setState({
                        result : searchResultCollection.models,
                        loading : false,
                        pageTotal : Math.round(resp.total / PAGE_SIZE),
                        currentPage : page,
                        query : query,
                        total : resp.total,
                        correctQuery : resp.correctQuery
                    });
                }.bind(this));
            },
            componentDidMount : function () {
                searchPageRouter.on('route:search', function (query) {
                    this.setState({
                        keyword : query || '',
                        loading : true,
                        query : query
                    });

                    this.queryAsync(query, this.state.currentPage);
                }, this);
            },
            onSearchAction : function (keyword) {
                searchPageRouter.navigate('q/' + keyword, {
                    trigger : true
                });
            },
            onPaginationSelect : function (target) {
                this.queryAsync(this.state.query, target);
            },
            render : function () {
                return (
                    <div>
                        <SearchBoxView
                            class="o-search-box-ctn"
                            onAction={this.onSearchAction}
                            keyword={this.state.keyword} />
                        <SearchResultView
                            keyword={this.state.keyword}
                            list={this.state.result}
                            loading={this.state.loading}
                            total={this.state.total}
                            correctQuery={this.state.correctQuery} />
                        <PaginationView
                            total={this.state.pageTotal}
                            current={this.state.currentPage}
                            onSelect={this.onPaginationSelect} />
                    </div>
                );
            }
        });

        return SearchPage;
    });
}(this));
