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
                var selected = this.props.filterSelected[prop];

                var eles = _.map(this.props.filters[prop], function (item, i) {
                    var className = 'item';
                    if (item.name) {
                        className = selected === item.name ? className + ' selected' : className;
                    } else {
                        if (selected) {
                            var range = selected.split('-');
                            className = (Number(range[0]) === item.begin && Number(range[1]) === item.end) ? className + ' selected' : className;
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
            getRankTypeEle : function () {
                var filters = [{
                    name : Wording.REL,
                    type : 'rel'
                }, {
                    name : Wording.HOT,
                    type : 'hot'
                }, {
                    name : Wording.RATING,
                    type : 'rate'
                }, {
                    name : Wording.UPDATE_TIME,
                    type : 'update'
                }];

                var selected = this.props.filterSelected['rank'];

                var eles = _.map(filters, function (item, i) {
                    var className = selected === item.type ? 'item selected' : 'item';
                    if (item.type === 'rel' && this.props.filters.categories) {
                        return;
                    } else {
                        return <li onClick={this.clickItem.bind(this, 'rank', item)} class={className} key={i}>{item.name}</li>
                    }
                }, this);

                return (
                    <li class="o-filter-cate-ctn">
                        <span class="title w-text-info">{Wording.SORT}</span>
                        <ul class="o-filter-cate w-text-secondary">
                            {eles}
                        </ul>
                    </li>
                );
            },
            generateTypeEle : function () {
                var filters = [{
                    name : Wording.TV,
                    type : 'tv'
                }, {
                    name : Wording.MOVIE,
                    type : 'movie'
                }, {
                    name : Wording.COMIC,
                    type : 'comic'
                }, {
                    name : Wording.VARIETY,
                    type : 'variety'
                }];

                var selected = this.props.filterSelected['type'];

                var eles = _.map(filters, function (item, i) {
                    var className = selected === item.type ? 'item selected' : 'item';
                    return <li onClick={this.clickItem.bind(this, 'type', item)} class={className} key={i}>{item.name}</li>
                }, this);

                var className = !selected ? 'item selected' : 'item';

                return (
                    <li class="o-filter-cate-ctn">
                        <span class="title w-text-info">{Wording.CHANNEL}</span>
                        <ul class="o-filter-cate w-text-secondary">
                            <li onClick={this.clickItem.bind(this, 'type', '')} class={className}>{Wording.ALL}</li>
                            {eles}
                        </ul>
                    </li>
                );
            },
            render : function () {
                return (
                    <ul class="o-filter-ctn">
                        {this.props.filters.categories ? '' : this.generateTypeEle()}
                        {this.props.filters.categories ? this.generateEle(Wording.CATEGORY, 'categories') : ''}
                        {this.generateEle(Wording.AREAS, 'areas')}
                        {this.generateEle(Wording.TIME  , 'years')}
                        {this.getRankTypeEle()}
                    </ul>
                );
            }
        });

        return FilterView;
    });
}(this));
