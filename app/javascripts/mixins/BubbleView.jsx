/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        '_',
        '$',
        'Wording',
        'GA'
    ], function (
        React,
        _,
        $,
        Wording,
        GA
    ) {
        var BubbleView = {

            getInitialState : function () {
                return {
                    show : false,
                    source : ''
                }
            },
            getBubbleClassName : function (className) {
                return this.state.show ? ('bubble ' + className + ' show') : ('bubble ' + className);
            },
            closeBubble : function () {
                this.setState({
                    show : false,
                    source : ''
                });
            }
        }

        return BubbleView;
    });
}(this));
