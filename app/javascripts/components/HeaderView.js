/** @jsx React.DOM */
(function (window) {
    define([
        'react',
        '_'
    ], function (
        React,
        _
    ) {
        var cates = ['电视剧', '电影'];

        var HeaderView = React.createClass({displayName: 'HeaderView',
            render : function () {
                var cateList = _.map(cates, function (cate) {
                    return React.DOM.li(null, cate);
                });

                return React.DOM.header(null, cateList);
            }
        });

        return HeaderView;
    });
}(this));
