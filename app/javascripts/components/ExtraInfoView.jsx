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
                        content.push(<dt className="w-text-info" key={field + 'dt'}>{Wording[field.toUpperCase() + '_LABEL']}</dt>);
                        if (data[field] instanceof Array) {
                            _.each(data[field], function (f, i) {
                                content.push(<dd className="w-wc" key={field + f + i}>{f}</dd>);
                            });
                        } else {
                            content.push(<dd className="w-wc" key={field + 'dd'}>{data[field]}</dd>);
                        }
                    }
                });

                return (
                    <div className="extra-info">
                        <h5>{Wording.EXTRA_INFO}</h5>
                        <dl>
                            {content}
                            <dd className="w-wc"><a className="w-text-normal" href={'http://www.baidu.com/s?wd=' + this.props.video.get('title')} target="_default">其他来源</a></dd>
                        </dl>
                    </div>
                );
            }
        });

        return ExtraInfoView;
    });
}(this));
