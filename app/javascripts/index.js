/** @jsx React.DOM */
require.config({
    paths : {
        $ : '../components/jquery/jquery',
        _ : '../components/underscore/underscore',
        Backbone : '../components/backbone/backbone',
        React : '../components/react/react'
    },
    shim : {
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
        'components/CategoryFilterView'
    ], function (
        React,
        IO,
        CategoryFilterView
    ) {
        React.renderComponent(CategoryFilterView( {'data-cate' : 'tv'}), document.body);
    });
}(this, document));
