/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        '_',
        '$',
        'Wording',
        'mixins/BubbleView',
        'main/DownloadHelper',
        'utilities/ProviderInfo',
        'utilities/ReadableSize',
        'GA'
    ], function (
        React,
        _,
        $,
        Wording,
        BubbleView,
        DownloadHelper,
        ProviderInfo,
        ReadableSize,
        GA
    ) {
        var providerInfo = {};

        var AppBubbleView = React.createClass({
            mixins : [BubbleView],
            componentWillMount : function () {
                ProviderInfo.init();
            },
            componentWillReceiveProps : function (nextProps) {
                if (nextProps.name) {
                    providerInfo = ProviderInfo.getObj(nextProps.name);
                }
            },
            downloadApp : function (provider) {
                if (provider.title !== undefined) {
                    DownloadHelper.downloadPlayerAsync(provider);

                    if (this.props.key && $('.item').eq(this.props.key) && $('.item').eq(this.props.key).find('.bubble-app')) {
                        $('.item').eq(this.props.key).find('.bubble-app').eq(0).hide();
                    } else if ($('.download-info') && $('.download-info').eq(0).find('.bubble-app')) {
                        $('.download-info').eq(0).find('.bubble-app').eq(0).hide();
                    }

                    GA.log({
                        'event' : 'video.app.promotion',
                        'type' : 'passive',
                        'app' : provider.title
                    });
                }
            },
            render : function () {
                return (
                    <div className="bubble-app w-text-secondary">
                        <p>
                            任务已开始 :) 为方便在手机上看视频 <br />推荐你安装下面的应用
                        </p>
                        <div className="app-item">
                            <img src={providerInfo ? providerInfo.iconUrl : ''} alt={this.props.name} />
                            <div className="app-info">
                                <p><strong>{this.props.name}</strong></p>
                                <a href="javascript:;" className="w-btn w-btn-mini w-btn-primary" onClick={this.downloadApp.bind(this, providerInfo)}>{Wording.APP_INSTALL}</a>
                            </div>
                        </div>
                    </div>
                );
            }
        });

        return AppBubbleView;
    });
}(this));
