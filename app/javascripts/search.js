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
        'Backbone',
        'IO',
        'searchpage/SearchPageRouter',
        'searchpage/SearchPage'
    ], function (
        React,
        Backbone,
        IO,
        SearchPageRouter,
        SearchPage
    ) {
        React.renderComponent(SearchPage(), document.body);

        Backbone.history.start();
    });
}(this, this.document));
