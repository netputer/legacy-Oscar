/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '$',
        'IO',
        'Actions',
        'Wording'
    ], function (
        React,
        $,
        IO,
        Actions,
        Wording
    ) {

        var FilterView = React.createClass({
            getDefaultProps : function () {
                return {
                    filters : {}
                };
            },
            clickItem : function (prop, value) {
                this.props.onFilterSelect(prop, value);
            },
            generateEle : function (title, prop) {
                var eles = _.map(this.props.filters[prop], function (item, i) {
                    return <li onClick={this.clickItem.bind(this, prop, item)} class="item" key={i}>{item.name || item.begin}</li>
                }, this);

                return (
                    <li class="o-filter-cate-ctn">
                        <span class="title w-text-info">{title}</span>
                        <ul class="o-filter-cate w-text-secondary">
                            <li onClick={this.clickItem.bind(this, prop, 'all')} class="item" >{Wording.ALL}</li>
                            {eles}
                        </ul>
                    </li>
                );
            },
            render : function () {
                return (
                    <ul class="o-filter-ctn">
                        {this.generateEle(Wording.CATEGORY, 'categories')}
                        {this.generateEle(Wording.AREAS, 'areas')}
                        {this.generateEle(Wording.TIME  , 'years')}
                    </ul>
                );
            }
        });

        return FilterView;
    });
}(this));
