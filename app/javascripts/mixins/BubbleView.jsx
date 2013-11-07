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
            closeBubble : function (type) {
                this.setState({
                    show : false,
                    source : ''
                });
                GA.log({
                    'event' : 'video.misc.action',
                    'action' : 'subscribe_popup',
                    'type' : type,
                    'pos' : 'bubble_button',
                    'video_id' : this.props.video !== undefined ? this.props.video.id : ''
                });
            }
        }

        return BubbleView;
    });
}(this));
