
/** @jsx React.DOM */
(function (window) {
    define([
        'React'
    ], function (
        React
    ) {
        var LoadingView = React.createClass({
            render : function () {
                return (
                    <div class="w-ui-loading">
                        <div class="anima">
                            <div class="rotor rotor1"></div>
                            <div class="rotor rotor2"></div>
                            <div class="rotor rotor3"></div>
                            <div class="rotor rotor4"></div>
                            <div class="rotor rotor5"></div>
                            <div class="rotor rotor6"></div>
                            <div class="rotor rotor7"></div>
                            <div class="rotor rotor8"></div>
                        </div>
                    </div>
                );
            }
        });

        return LoadingView;
    });
}(this));
