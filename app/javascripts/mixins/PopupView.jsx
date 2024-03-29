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
        var PopupView = {
            getInitialState : function () {
                return {
                    show : !localStorage.getItem('declaration')
                };
            },
            hidePopup : function () {
                this.setState({
                    show : false
                });

                localStorage.setItem('declaration', '1');

                $('body').toggleClass('overflow', location.hash.indexOf('detail/') > 0);
            }
        }

        return PopupView;
    });
}(this));
