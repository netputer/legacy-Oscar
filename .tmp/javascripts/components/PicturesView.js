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
                        this.renderSmallPicture(),
                        this.renderBigPicture()
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
                            React.DOM.a( {className:this.state.disablePrev ? 'prev disabled' : 'prev', onClick:this.clickPrev}),
                            React.DOM.a( {className:this.state.disableNext ? 'next disabled' : 'next', onClick:this.clickNext})
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
                    React.DOM.div( {className:this.state.showLarge ? 'o-big-pictures-container show' : 'o-big-pictures-container'}, 
                        React.DOM.img( {src:this.state.largeSrc, ref:"bigPicture"})
                    )
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
