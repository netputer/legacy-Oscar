/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        'Wording',
        'utilities/FormatString',
    ], function (
        React,
        _,
        Wording,
        FormatString
    ) {
        var TabView = React.createClass({
            getInitialState : function () {
                return {
                    show : false,
                    tabs : []
                };
            },
            clickTab : function (target) {
                this.props.selectTab.call(this, target);

                this.setState({
                    show : false
                });
                return false;
            },
            getTabs : function () {
                var tabs = [];
                var className = 'h5 ';
                if (this.props.tabs) {
                    tabs = this.props.tabs;
                    className = '';
                } else if (this.props.type !== 'MOVIE') {
                    tabs = ['series', 'detail', 'related', 'comments'];
                } else {
                    tabs = ['detail', 'related', 'comments'];
                }
                return _.map(tabs, function (item, index) {
                    if (index < 4) {
                        return (
                            <li onClick={this.clickTab.bind(this, item)}
                                className={this.props.selectedTab === item ? className + 'tab selected' : className + 'tab'}>{Wording[item.toUpperCase()] || FormatString(Wording.UPDATE_EPISODE, item)}</li>

                        );
                    } else if (index == 4) {
                        return (
                            <li onClick={this.toggleShow} className={this.props.selectedTab === item ? className + 'tab selected' : className + 'tab'}>
                                {Wording[item.toUpperCase()] || FormatString(Wording.UPDATE_EPISODE, item)}
                                {this.showEpisodes()}
                            </li>
                        );
                    }
                }.bind(this));
            },
            toggleShow : function () {
                this.setState({
                    show : !this.state.show
                });
            },
            chooseEpisodes : function () {
                if (this.props.totalSize > 400) {
                    return (
                        <div className="choose-arrow" onClick={this.toggleShow} />
                    );
                }
            },
            showEpisodes : function () {
                var count = this.props.totalSize - 400 + 1;
                var showItems = function () {

                    var times = Math.ceil(count/100) + 1;
                    var tmpArr = Array.apply(null, {length: times}).map(Number.call, Number);

                    return _.map(tmpArr, function (item, index) {
                        return (
                            <li className="w-text-thirdly" onClick={this.clickTab.bind(this, ((index+3)*100 + 1) + '-' + ((index + 4)*100 >= this.props.totalSize ? this.props.totalSize : (index + 4)*100))}>
                                {FormatString(Wording.UPDATE_EPISODE, ((index+3)*100 + 1) + '-' + ((index + 4)*100 >= this.props.totalSize ? this.props.totalSize : (index + 4)*100))}
                            </li>
                        );   
                    }.bind(this));

                }.bind(this);

                if (this.props.totalSize > 100 && this.state.show) {
                    return (
                        <ul className="select-episodes">
                            {showItems()}
                        </ul>
                    );
                }
            },
            render : function () {
                return (
                    <menu className="tab-ctn">
                        {this.getTabs()}
                        {this.props.tabs ? this.chooseEpisodes() : ''}
                    </menu>
                );
            }
        });

        return TabView;
    });
}(this));
