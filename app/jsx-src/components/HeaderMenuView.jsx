/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        '$'
    ], function (
        React,
        _,
        $
    ) {
        var HeaderMenuItem = React.createClass({
            clickItem : function (key) {
                this.props.onAction(key, this.getDOMNode());
            },
            render : function () {
                var className = 'w-text-secondary w-header-menu-item';
                return (
                    <li onClick={this.clickItem.bind(this, this.props['data-data'].key)}
                        class={className + (this.props['data-selected'] ? ' selected' : '')}>
                        {this.props['data-data'].name}
                    </li>
                );
            }
        });

        var HeaderMenuView = React.createClass({
            getInitialState : function () {
                return {
                    selectedItem : 'index'
                };
            },
            clickItem : function (key, menuItem) {
                this.setState({
                    selectedItem : key
                });

                this.moveMarker(menuItem);
                this.props.onAction(key);
            },
            moveMarker : function (menuItem) {
                var $menuItem = $(menuItem);
                var $marker = $(this.refs.headerMenuMarker.getDOMNode());

                $marker.css({
                    left : $menuItem.offset().left,
                    width : $menuItem[0].offsetWidth
                });
            },
            componentDidMount : function () {
                this.moveMarker(this.getDOMNode().getElementsByTagName('li')[0]);
            },
            render : function () {
                var cateList = _.map(this.props.cates, function (cate) {
                    return (<HeaderMenuItem onAction={this.clickItem} data-selected={this.state.selectedItem === cate.key} data-data={cate} key={cate.key} />);
                }, this);

                return (
                    <div class="w-header-menu">
                        <menu>{cateList}</menu>
                        <div class="marker" ref="headerMenuMarker" />
                    </div>
                );
            }
        });

        return HeaderMenuView;
    });
}(this));
