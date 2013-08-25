/** @jsx React.DOM */
(function (window) {
    define([
        '$',
        'React',
        '_',
        'Backbone',
        'utilities/FormatString'
    ], function (
        $,
        React,
        _,
        Backbone,
        FormatString
    ) {

        var textEnums = {
            PIC : '剧照',
            TOTLE : '{0} 张',
            RETURN : '返回'
        };

        var PicturesView = React.createClass({
            getInitialState : function () {

                this.largePics = this.props.data.l || [];
                this.smallPics = this.props.data.s || [];
                this.currentIndex = 0;

                return {
                    showLarge : false,
                    disablePrev : true,
                    disableNext : this.largePics.length ? false : true,
                    itemClass : '',
                    largeSrc : this.largePics[this.currentIndex]
                };
            },
            render : function () {

                return (
                    <div class="o-pictures-container">
                        {this.renderHeader()}
                        <div class="o-pictures-mask">
                        {this.renderBigPicture()}
                        {this.renderSmallPicture()}
                        </div>
                    </div>
                );
            },
            renderHeader : function () {

                var prevClass = 'prev';
                if (this.state.disablePrev) {
                    prevClass += ' disable';
                }

                var nextClass = 'next';
                if (this.state.disableNext) {
                    nextClass += ' disable';
                }

                return (
                    <div class="o-header-container">
                        <div class="info">
                            <span class="pic w-text-secondary">{textEnums.PIC}</span>
                            <span class="totle w-text-info">{FormatString(textEnums.TOTLE, [this.largePics.length])}</span>
                            {this.state.showLarge && <span class="w-text-info return" onClick={this.showSmall}>{textEnums.RETURN}</span>}
                        </div>
                        <div class="navigator">
                            <a class={prevClass} onClick={this.prev}>前一个</a>
                            <a class={nextClass} onClick={this.next}>后一个</a>
                        </div>
                    </div>
                );
            },
            prev : function () {

                var state = {};

                if (this.currentIndex === 0) {
                    return;
                }

                this.currentIndex --;
                state['largeSrc'] = this.largePics[this.currentIndex];

                if(this.state.showLarge) {
                    if (this.currentIndex === 0) {
                        state['disablePrev'] = true;
                    } else {
                        state['disablePrev'] = false;
                    }
                } else {
                    if (this.currentIndex >= 3) {
                        state['disablePrev'] = false;

                        var node = $(this.refs.item0.getDOMNode());
                        var marginLeft = parseInt(node.css('marginLeft'));
                        node.css('marginLeft', marginLeft + 110 + 'px');
                    } else {
                        state['disablePrev'] = true;
                    }
                }

                this.setState(state);
            },
            next : function () {
                var state = {};

                if (this.currentIndex === this.largePics.length - 1) {
                    return;
                }

                this.currentIndex ++;
                state['largeSrc'] = this.largePics[this.currentIndex];

                if(this.state.showLarge) {
                    if (this.currentIndex === this.largePics.length - 1) {
                        state['disableNext'] = true;
                    } else {
                        state['disableNext'] = false;
                    }
                } else {
                    if (this.currentIndex >= this.largePics.length - 3) {
                        state['disableNext'] = true;
                    } else {
                        state['disableNext'] = false;

                        var node = $(this.refs.item0.getDOMNode());
                        var marginLeft = parseInt(node.css('marginLeft'));
                        node.css('marginLeft', marginLeft - 110 + 'px');
                    }
                }

                this.setState(state);
            },
            renderSmallPicture : function () {
                var item = [];
                _.map(this.smallPics, function (pic, index) {
                    item.push(
                        <li class="o-picture-item" ref={"item" + index} onClick={this.showLarge}>
                            <img src={pic} class={this.state.itemClass}/>
                        </li>
                    );
                }.bind(this));

                return (
                    <ul class="o-small-pictures-container" ref="smallContainer">
                    {item}
                    </ul>
                );
            },
            componentDidMount : function () {
                _.map(this.refs, function (item) {
                    var node = item.getDOMNode();
                    node.onload = function () {
                        var width = this.width;
                        var height = this.height;

                        if (width >= height) {
                            this.className = 'horizontal';
                        } else {
                            this.className = 'vertical';
                        }
                    }
                });
            },
            showSmall : function () {
                var container = $(this.refs.smallContainer.getDOMNode());
                container.removeClass('hide');

                this.setState({
                    showLarge : false
                })
            },
            showLarge : function () {
                var container = $(this.refs.smallContainer.getDOMNode());
                container.addClass('hide');

                this.setState({
                    showLarge : true
                });
            },
            renderBigPicture : function () {
                return (
                    <div class={this.state.showLarge ? 'o-big-pictures-container show' : 'o-big-pictures-container'}>
                        <img src={this.state.largeSrc}/>
                    </div>
                );
            }
        });

        return PicturesView;
    });
}(this));
