/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        'components/searchbox/SearchBoxView',
        'components/SearchResultView',
        'mixins/FilterNullValues',
        'SearchPageRouter'
    ], function (
        React,
        SearchBoxView,
        SearchResultView,
        FilterNullValues,
        SearchPageRouter
    ) {
        var searchPageRouter = new SearchPageRouter();

        var queryAsync = function (keyword) {
            var deferred = $.Deferred();

            $.ajax({
                url : 'http://oscar.wandoujia.com/api/v1/search/' + keyword,
                success : deferred.resolve,
                error : deferred.reject
            });

            return deferred.promise();
        };

        var SearchPage = React.createClass({displayName: 'SearchPage',
            mixins : [FilterNullValues],
            getInitialState : function () {
                return {
                    keyword : searchPageRouter.getQuery(),
                    result : [],
                    loading : false
                }
            },
            componentDidMount : function () {
                searchPageRouter.on('route:search', function (query) {
                    this.setState({
                        keyword : query,
                        loading : true
                    });

                    queryAsync(query).done(function (resp) {
                        resp = this.filterNullVlaues(resp);
                        this.setState({
                            result : resp.videoList || [],
                            loading : false
                        });
                    }.bind(this));
                }, this);
            },
            onSearchAction : function (keyword) {
                searchPageRouter.navigate('q/' + keyword, {
                    trigger : true
                });
            },
            render : function () {
                return (
                    React.DOM.div(null, 
                        SearchBoxView(
                            {className:"o-search-box-ctn",
                            onAction:this.onSearchAction,
                            keyword:this.state.keyword} ),
                        SearchResultView(
                            {keyword:this.state.keyword,
                            list:this.state.result,
                            loading:this.state.loading} )
                    )
                );
            }
        });

        return SearchPage;
    });
}(this));
