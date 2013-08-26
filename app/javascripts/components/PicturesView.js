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

        var PicturesView = React.createClass({displayName: 'PicturesView',
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
                    React.DOM.div( {className:"o-pictures-container"}, 
                        this.renderHeader(),
                        React.DOM.div( {className:"o-pictures-mask"}, 
                        this.renderBigPicture(),
                        this.renderSmallPicture()
                        )
                    )
                );
            },
            renderHeader : function () {
                return (
                    React.DOM.div( {className:"o-header-container"}, 
                        React.DOM.div( {className:"info"}, 
                            React.DOM.span( {className:"pic w-text-secondary"}, textEnums.PIC),
                            React.DOM.span( {className:"totle w-text-info"}, FormatString(textEnums.TOTLE, [this.largePics.length])),
                            this.state.showLarge && React.DOM.span( {className:"w-text-info return", onClick:this.showSmall}, textEnums.RETURN)
                        ),
                        React.DOM.div( {className:"navigator"}, 
                            React.DOM.a( {className:this.state.disablePrev ? 'prev disable' : 'prev', onClick:this.clickPrev}, "前一个"),
                            React.DOM.a( {className:this.state.disableNext ? 'next disable' : 'next', onClick:this.clickNext}, "后一个")
                        )
                    )
                );
            },
            renderSmallPicture : function () {
                var item = [];
                _.map(this.smallPics, function (pic, index) {
                    item.push(
                        React.DOM.li( {className:"o-picture-item", ref:"item" + index, onClick:this.showLarge.bind(this, index)}, 
                            React.DOM.img( {src:pic})
                        )
                    );
                }.bind(this));

                return (
                    React.DOM.ul( {className:this.state.showLarge ? 'o-small-pictures-container hide' : 'o-small-pictures-container', ref:"smallContainer"}, item)
                );
            },
            renderBigPicture : function () {
                return (
                    React.DOM.div( {className:this.state.showLarge ? 'o-big-pictures-container show' : 'o-big-pictures-container', ref:"bigContainer"}, 

                        React.DOM.img( {src:this.state.largeSrc})
                    )
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
