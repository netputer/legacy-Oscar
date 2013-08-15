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

        var FilterList = React.createClass({
            getInitialState : function () {
                var categoriesCollection = new CategoriesCollection();
                categoriesCollection.data.type = this.props['data-cate'];
                categoriesCollection.fetch({
                    success : function (categoriesCollection) {
                        this.setState({
                            catesList : categoriesCollection.map(function (cate) {
                                return <span>{cate.get('name')}</span>;
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
                    <dd>
                        <span>全部</span>
                        {this.state.catesList}
                    </dd>
                );
            }
        });

        var CATE_MAPPING = {
            tv : '电视剧',
            movie : '电影'
        };

        var CategoryFilterView = React.createClass({
            render : function () {
                return (
                    <div class="o-cate-filter">
                        <h1 class="o-cate-filter title">{CATE_MAPPING[this.props['data-cate']]}</h1>
                        <dl>
                            <dt>类型</dt>
                            <FilterList data-cate={this.props['data-cate']} />
                        </dl>
                    </div>
                );
            }
        });

        return CategoryFilterView;
    });
}(this));
