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

        var HeaderView = React.createClass({
            render : function () {
                var cateList = _.map(cates, function (cate) {
                    return <li>{cate}</li>;
                });

                return <header>{cateList}</header>;
            }
        });

        return HeaderView;
    });
}(this));
