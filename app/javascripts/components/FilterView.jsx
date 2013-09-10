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
                    var selected = this.props.filterSelected[prop];
                    var className = 'item';
                    if (item.name) {
                        className = selected === item.name ? className + ' selected' : className;
                    } else {
                        if (selected) {
                            selected = selected.split('-');
                            className = (Number(selected[0]) === item.begin && Number(selected[1]) === item.end) ? className + ' selected' : className;
                        }
                    }

                    if (item.name) {
                        return <li onClick={this.clickItem.bind(this, prop, item)} class={className} key={i}>{item.name}</li>
                    } else {
                        return <li onClick={this.clickItem.bind(this, prop, item)} class={className} key={i}>{Number(item.begin) === 0 ? Wording.EARLY : item.begin}</li>
                    }
                }, this);

                var className = !this.props.filterSelected[prop] ? 'item selected' : 'item';
                return (
                    <li class="o-filter-cate-ctn">
                        <span class="title w-text-info">{title}</span>
                        <ul class="o-filter-cate w-text-secondary">
                            <li onClick={this.clickItem.bind(this, prop, 'all')} class={className} >{Wording.ALL}</li>
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
