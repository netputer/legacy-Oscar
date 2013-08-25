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

                var prevClass = 'prev';
                if (this.state.disablePrev) {
                    prevClass += ' disable';
                }

                var nextClass = 'next';
                if (this.state.disableNext) {
                    nextClass += ' disable';
                }

                return (
                    React.DOM.div( {className:"o-header-container"}, 
                        React.DOM.div( {className:"info"}, 
                            React.DOM.span( {className:"pic w-text-secondary"}, textEnums.PIC),
                            React.DOM.span( {className:"totle w-text-info"}, FormatString(textEnums.TOTLE, [this.largePics.length])),
                            this.state.showLarge && React.DOM.span( {className:"w-text-info return", onClick:this.showSmall}, textEnums.RETURN)
                        ),
                        React.DOM.div( {className:"navigator"}, 
                            React.DOM.a( {className:prevClass, onClick:this.prev}, "前一个"),
                            React.DOM.a( {className:nextClass, onClick:this.next}, "后一个")
                        )
                    )
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
                        React.DOM.li( {className:"o-picture-item", ref:"item" + index, onClick:this.showLarge}, 
                            React.DOM.img( {src:pic, className:this.state.itemClass})
                        )
                    );
                }.bind(this));

                return (
                    React.DOM.ul( {className:"o-small-pictures-container", ref:"smallContainer"}, 
                    item
                    )
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
                    React.DOM.div( {className:this.state.showLarge ? 'o-big-pictures-container show' : 'o-big-pictures-container'}, 
                        React.DOM.img( {src:this.state.largeSrc})
                    )
                );
            }
        });

        return PicturesView;
    });
}(this));
