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
        var whiteList = ['alias', 'screenwriters', 'directors', 'dubbings', 'language', 'region', 'downloadCount', 'providerNames'];

        var ExtraInfoView = React.createClass({
            render : function () {
                var data = this.props.video.toJSON();
                var content = [];

                _.each(whiteList, function (field, i) {
                    if (data[field] && data[field].length) {
                        content.push(<dt class="w-text-info" key={field + 'dt'}>{Wording[field.toUpperCase() + '_LABEL']}</dt>);
                        if (data[field] instanceof Array) {
                            _.each(data[field], function (f, i) {
                                content.push(<dd class="w-wc" key={field + f + i}>{f}</dd>);
                            });
                        } else {
                            content.push(<dd class="w-wc" key={field + 'dd'}>{data[field]}</dd>);
                        }
                    }
                });

                return (
                    <div class="extra-info">
                        <h5>{Wording.EXTRA_INFO}</h5>
                        <dl>{content}</dl>
                    </div>
                );
            }
        });

        return ExtraInfoView;
    });
}(this));
