/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        'Wording',
        'main/DownloadHelper',
        'utilities/ProviderInfo'
    ], function (
        React,
        Wording,
        DownloadHelper,
        ProviderInfo
    ) {

        var providerInfo = {};

        var whiteList = ['alias', 'screenwriters', 'directors', 'dubbings', 'language', 'region', 'downloadCount', 'providerNames'];



        var ExtraInfoView = React.createClass({
            pickProvider : function (name) {
                return ProviderInfo.getObj(name);
            },
            clickButton : function (provider) {
                if (provider) {
                    DownloadHelper.downloadPlayerAsync(provider);
                    GA.log({
                        'event' : 'video.app.promotion',
                        'type' : 'initiative',
                        'app' : provider.title
                    });

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
                                    if (this.pickProvider(f) !== undefined) {
                                        obj = this.pickProvider(f);
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
