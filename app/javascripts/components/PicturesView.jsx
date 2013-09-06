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
                        {this.renderSmallPicture()}
                        {this.renderBigPicture()}
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
                    <div class={this.state.showLarge ? 'o-big-pictures-container show' : 'o-big-pictures-container'}>
                        <img src={this.state.largeSrc} ref="bigPicture"/>
                    </div>
                );
            },
            componentDidMount : function () {
                var node;
                for (var i = 0; i < this.largePics.length; i++) {
                    node = this.refs['item' + i].getDOMNode();

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

                node = this.refs['bigPicture'].getDOMNode();
                node.onload = function () {
                    var width = this.width;
                    var height = this.height;

                    if (width >= height) {
                        this.className = 'horizontal';
                    } else {
                        this.className = 'vertical';
                    }
                };
            },
            clickPrev : function () {

                if (this.state.showLarge) {

                    if (!this.state.disablePrev) {
                        this.largeIndex --;
                        this.setState({'largeSrc' : this.largePics[this.largeIndex]});
                        this.changeStateLarge();
                    }

                } else {

                    if (!this.state.disablePrev) {
                        var node = $(this.refs.item0.getDOMNode());
                        var marginLeft = parseInt(node.css('marginLeft'));
                        node.css('marginLeft', marginLeft + 110 + 'px');

                        this.lastShowIndex ++;
                        this.changeStateSmall();
                    }
                }
            },
            clickNext : function () {

                if (this.state.showLarge) {

                    if (!this.state.disableNext) {
                        this.largeIndex ++;
                        this.setState({'largeSrc' : this.largePics[this.largeIndex]});
                        this.changeStateLarge();
                    }

                } else {
                    if (!this.state.disableNext) {
                        var node = $(this.refs.item0.getDOMNode());
                        var marginLeft = parseInt(node.css('marginLeft'));
                        node.css('marginLeft', marginLeft - 110 + 'px');

                        this.lastShowIndex ++;
                        this.changeStateSmall();
                    }
                }
            },
            showSmall : function () {

                this.changeStateSmall();
                this.setState({
                    showLarge : false
                })
            },
            showLarge : function (index, evt) {
                this.largeIndex = index;
                this.changeStateLarge();

                this.setState({
                    showLarge : true,
                    largeSrc : this.largePics[index]
                });
            },
            changeStateSmall : function () {
                var state = {
                    disableNext : true,
                    disablePrev : true
                };

                if (this.lastShowIndex < this.largePics.length - 1 ){
                    state['disableNext'] = false;
                }

                if (this.lastShowIndex > 3 ) {
                    state['disablePrev'] = false;
                }

                this.setState(state);
            },
            changeStateLarge : function () {
                var state = {
                    disablePrev : true,
                    disableNext : true
                };

                if (this.largeIndex > 0) {
                    state['disablePrev'] = false;
                }

                if (this.largeIndex < this.largePics.length - 1){
                    state['disableNext'] = false;
                }

                this.setState(state);
            }
        });

        return PicturesView;
    });
}(this));
