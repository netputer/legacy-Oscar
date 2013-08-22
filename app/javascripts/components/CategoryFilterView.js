/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        'Backbone'
    ], function (
        React,
        _,
        Backbone
    ) {
        var CategoriesCollection = Backbone.Collection.extend({
            url : 'http://oscar.wandoujia.com/api/v1/categories',
            type : 'get',
            data : {}
        });

        var FilterList = React.createClass({displayName: 'FilterList',
            getInitialState : function () {
                var categoriesCollection = new CategoriesCollection();
                categoriesCollection.data.type = this.props['data-cate'];
                categoriesCollection.fetch({
                    success : function (categoriesCollection) {
                        this.setState({
                            catesList : categoriesCollection.map(function (cate) {
                                return React.DOM.span(null, cate.get('name'));
                            })
                        });
                    }.bind(this)
                });

                return {
                    catesList : []
                };
            },
            render : function () {
                return (
                    React.DOM.dd(null,
                        React.DOM.span(null, "全部"),
                        this.state.catesList
                    )
                );
            }
        });

        var CATE_MAPPING = {
            tv : '电视剧',
            movie : '电影'
        };

        var CategoryFilterView = React.createClass({displayName: 'CategoryFilterView',
            render : function () {
                return (
                    React.DOM.div( {className:"o-cate-filter"},
                        React.DOM.h1( {className:"o-cate-filter title"}, CATE_MAPPING[this.props['data-cate']]),
                        React.DOM.dl(null,
                            React.DOM.dt(null, "类型"),
                            FilterList( {'data-cate':this.props['data-cate']} )
                        )
                    )
                );
            }
        });

        return CategoryFilterView;
    });
}(this));
