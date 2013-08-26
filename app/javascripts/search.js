/** @jsx React.DOM */
require.config({
    paths : {
        $ : '../components/jquery/jquery',
        _ : '../components/underscore/underscore',
        Backbone : '../components/backbone/backbone',
        React : '../components/react/react'
    },
    shim : {
        $ : {
            deps : [],
            exports : '$'
        },
        _ : {
            deps : [],
            exports : '_'
        },
        Backbone : {
            deps : ['$', '_'],
            exports : 'Backbone'
        }
    }
});

(function (window, document) {
    require([
        'React',
        'IO',
        'components/searchbox/SearchBoxView',
        'components/SearchResultView',
        'utilities/QueryString'
    ], function (
        React,
        IO,
        SearchBoxView,
        SearchResultView,
        QueryString
    ) {
        var keyword = QueryString.get('keyword');

        var searchResultView = SearchResultView( {keyword:keyword} );

        var onSearchAction = function (keyword) {
            searchResultView.doSearch(keyword);
        };

        React.renderComponent(SearchBoxView( {keyword:keyword, onAction:onSearchAction} ), document.getElementsByClassName('o-search-box-ctn')[0]);
        React.renderComponent(searchResultView, document.getElementsByClassName('o-search-result-ctn')[0]);
    });
}(this, document));
