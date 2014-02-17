/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        'Wording',
        'main/DownloadHelper'
    ], function (
        React,
        Wording,
        DownloadHelper
    ) {

        var providers;

        var whiteList = ['alias', 'screenwriters', 'directors', 'dubbings', 'language', 'region', 'downloadCount', 'providerNames'];

        var pickProvider = function (name) {
            return _.where(providers, {title : name});
        };

        var ExtraInfoView = React.createClass({
            componentWillMount : function () {
                if (typeof DownloadHelper.getProviders().done !== 'undefined') {
                    providers = DownloadHelper.getProviders().done(function (resp) {
                        providers = resp;
                    });
                } else {
                    providers = DownloadHelper.getProviders();
                }
            },
            clickButton : function (provider) {
                if (provider) {
                    DownloadHelper.downloadPlayerAsync(provider);
                }
            },
            render : function () {
                var data = this.props.video.toJSON();
                var content = [];

                _.each(whiteList, function (field, i) {
                    if (data[field] && data[field].length) {
                        content.push(<dt className="w-text-info" key={field + 'dt'}>{Wording[field.toUpperCase() + '_LABEL']}</dt>);

                        if (data[field] instanceof Array) {
                            if (field === 'providerNames') {
                                var icon;
                                var obj;
                                _.each(data[field], function (f, i) {
                                    if (pickProvider(f)[0] !== undefined) {
                                        obj = pickProvider(f)[0];
                                        icon = obj.iconUrl.replace('256_256', '48_48');
                                    }
                                    content.push(<dd className="w-wc providers-item" key={field + f + i}><img src={icon} alt={f} />{f}<button className="w-btn w-btn-mini w-btn-primary" onClick={this.clickButton.bind(this, obj)}>{Wording.APP_INSTALL}</button></dd>);
                                }, this);
                            } else {
                                _.each(data[field], function (f, i) {
                                        content.push(<dd className="w-wc" key={field + f + i}>{f}</dd>);
                                    });
                            }
                        } else {
                            content.push(<dd className="w-wc" key={field + 'dd'}>{data[field]}</dd>);
                        }
                    }
                }, this);

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
