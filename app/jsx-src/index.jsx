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
        'components/HeaderMenuView',
        'components/SearchBoxView',
        'components/CommentaryView'
    ], function (
        React,
        IO,
        HeaderMenuView,
        SearchBoxView,
        CommentaryView
    ) {
        var IndexView = React.createClass({
            render : function () {
                return (
                    <div>
                        <HeaderMenuView />
                        <SearchBoxView />
                        <CommentaryView />
                    </div>
                );
            }
        });

        React.renderComponent(<IndexView />, document.body);
    });
}(this, document));
