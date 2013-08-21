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
        var IndexView = React.createClass({displayName: 'IndexView',
            render : function () {
                return (
                    React.DOM.div(null, 
                        HeaderMenuView(null ),
                        SearchBoxView(null ),
                        CommentaryView(null )
                    )
                );
            }
        });

        React.renderComponent(IndexView(null ), $('.sample-search')[0]);
    });
}(this, document));

(function (window, document) {
    require([
        '$',
        'React',
        'IO',
        'components/WanxiaodouView'
    ], function (
        $,
        React,
        IO,
        WanxiaodouView
    ) {
        React.renderComponent(WanxiaodouView( {'data-tip':"xxxxxx", 'data-type':"NO_SEARCH_RESULT"}), $('.sample-wanxiaodou')[0]);
    });
}(this, document));

(function (window, document) {
    require([
        '$',
        'React',
        'IO',
        'components/PageView'
    ], function (
        $,
        React,
        IO,
        PageView
    ) {
        var data = {
            current : 10,
            total : 20,
            win : 5
        };
        React.renderComponent(PageView( {'data':data}), $('.sample-pagecount')[0]);
    });
}(this, document));
