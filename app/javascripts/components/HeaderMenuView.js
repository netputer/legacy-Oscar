/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_'
    ], function (
        React,
        _
    ) {
        var cates = [{
            name : '首页',
            key : 'index'
        }, {
            name : '电视剧',
            key : 'tv'
        }, {
            name : '电影',
            key : 'movie'
        }, {
            name : '综艺',
            key : 'variety'
        }, {
            name : '动漫',
            key : 'comic'
        }];

        var HeaderMenuView = React.createClass({displayName: 'HeaderMenuView',
            render : function () {
                var cateList = _.map(cates, function (cate, index) {
                    return React.DOM.li( {className:"w-text-secondary", key:cate.key}, cate.name);
                });

                return React.DOM.menu( {className:"w-header-menu"}, cateList);
            }
        });

        return HeaderMenuView;
    });
}(this));
