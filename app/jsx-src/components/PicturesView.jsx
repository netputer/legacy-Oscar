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
                this.lastShowIndex = this.largePics.length >= 4 ? 3 : this.largePics.length;
                this.largeIndex = 0;

                return {
                    showLarge : false,
                    disablePrev : true,
                    disableNext : this.largePics.length ? false : true,
                    largeSrc : this.largePics[this.largeIndex]
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
                return (
                    <div class="o-header-container">
                        <div class="info">
                            <span class="pic w-text-secondary">{textEnums.PIC}</span>
                            <span class="totle w-text-info">{FormatString(textEnums.TOTLE, [this.largePics.length])}</span>
                            {this.state.showLarge && <span class="w-text-info return" onClick={this.showSmall}>{textEnums.RETURN}</span>}
                        </div>
                        <div class="navigator">
                            <a class={this.state.disablePrev ? 'prev disable' : 'prev'} onClick={this.clickPrev}>前一个</a>
                            <a class={this.state.disableNext ? 'next disable' : 'next'} onClick={this.clickNext}>后一个</a>
                        </div>
                    </div>
                );
            },
            renderSmallPicture : function () {
                var item = [];
                _.map(this.smallPics, function (pic, index) {
                    item.push(
                        <li class="o-picture-item" ref={"item" + index} onClick={this.showLarge.bind(this, index)}>
                            <img src={pic}/>
                        </li>
                    );
                }.bind(this));

                return (
                    <ul class={this.state.showLarge ? 'o-small-pictures-container hide' : 'o-small-pictures-container'} ref="smallContainer">{item}</ul>
                );
            },
            renderBigPicture : function () {
                return (
                    <div class={this.state.showLarge ? 'o-big-pictures-container show' : 'o-big-pictures-container'} ref="bigContainer">

                        <img src={this.state.largeSrc}/>
                    </div>
                );
            },
            componentDidMount : function () {
                var node;
                for (var i = 0; i < this.largePics.length; i++) {
                    node = this.refs['item' + i];

                    node.onload = function () {
                        var width = this.width;
                        var height = this.height;

                        if (width >= height) {
                            this.className = 'horizontal';
                        } else {
                            this.className = 'vertical';
                        }
                    }
                }
            },
            clickPrev : function () {

                var state = {};

                if (this.state.showLarge) {
                    if (this.largeIndex === 0) {
                        state['disablePrev'] = true;
                    } else {
                        state['disablePrev'] = false;
                        this.largeIndex --;
                        state['largeSrc'] = this.largePics[this.largeIndex];
                    }
                } else {

                    if (this.lastShowIndex <= 3) {
                        state['disablePrev'] = true;
                    } else {
                        state['disablePrev'] = false;

                        var node = $(this.refs.item0.getDOMNode());
                        var marginLeft = parseInt(node.css('marginLeft'));
                        node.css('marginLeft', marginLeft + 110 + 'px');

                        this.lastShowIndex --;
                    }

                }
                this.setState(state);
            },
            clickNext : function () {

                var state = {};

                if (this.state.showLarge) {
                    if (this.largeIndex === this.largePics.length - 1) {
                        state['disableNext'] = true;
                    } else {
                        state['disableNext'] = false;
                        this.largeIndex ++;
                        state['largeSrc'] = this.largePics[this.largeIndex];
                    }
                } else {

                    if (this.lastShowIndex === this.largePics.length - 1) {
                        state['disableNext'] = true;
                    } else {
                        state['disableNext'] = false;

                        var node = $(this.refs.item0.getDOMNode());
                        var marginLeft = parseInt(node.css('marginLeft'));
                        node.css('marginLeft', marginLeft - 110 + 'px');

                        this.lastShowIndex ++;
                    }

                }
                this.setState(state);
            },
            showSmall : function () {
                var smallContainer = $(this.refs.smallContainer.getDOMNode());
                smallContainer.css('transition-delay', '.6s');

                var bigContainer = $(this.refs.bigContainer.getDOMNode());
                bigContainer.css('transition-delay', '0s');

                this.setState({
                    showLarge : false
                })
            },
            showLarge : function (index, evt) {
                var smallContainer = $(this.refs.smallContainer.getDOMNode());
                smallContainer.css('transition-delay', '0');

                var bigContainer = $(this.refs.bigContainer.getDOMNode());
                bigContainer.css('transition-delay', '.2s');

                this.largeIndex = index;

                this.setState({
                    showLarge : true,
                    largeSrc : this.largePics[index]
                });
            }
        });

        return PicturesView;
    });
}(this));
