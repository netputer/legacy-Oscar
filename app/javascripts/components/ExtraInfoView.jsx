/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        'Wording'
    ], function (
        React,
        Wording
    ) {

        var ExtraInfoView = React.createClass({
            render : function () {
                var data = this.props.video.toJSON();
                return (
                    <div class="extra-info">
                        <h5>{Wording.EXTRA_INFO}</h5>
                    </div>
                );
            }
        });

        return ExtraInfoView;
    });
}(this));
