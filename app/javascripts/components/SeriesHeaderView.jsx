/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        'Wording',
        'utilities/FormatString',
        'mixins/ElementsGenerator',
        'components/SubscribeBubbleView',
        'components/ProvidersBubbleView'
    ], function (
        React,
        Wording,
        FormatString,
        ElementsGenerator,
        SubscribeBubbleView,
        ProvidersBubbleView
    ) {

        var SeriesHeaderView = React.createClass({
            mixins : [ElementsGenerator],
            componentWillMount : function () {
                this.subscribeBubbleView = <SubscribeBubbleView video={this.props.video} subscribeHandler={this.subscribeCallback} />
                this.providersBubbleView = <ProvidersBubbleView video={this.props.video} id="providers" />
            },
            componentDidMount : function () {
                if (this.props.video.get('subscribeUrl') !== undefined) {
                    $.ajax({
                        url : 'http://feed.wandoujia.com/api/v1/subscription/subscribed',
                        data : {
                            uri : this.props.video.get('subscribeUrl'),
                            user : 'device_only'
                        },
                        success : function (data) {
                            if (data === 'true') {
                                this.props.subscribeHandler.call(this, 1);
                            } else {
                                this.props.subscribeHandler.call(this, 0);
                            }
                        }.bind(this)
                    });
                }
            },
            subscribeCallback : function (statusCode) {
                this.props.subscribeHandler.call(this, statusCode);
            },
            render : function () {
                var data = this.props.video.toJSON();
                var stillsBgStyle = {
                    'background-image' : 'url(' + (data.cover.s || "") + ')'
                };

                return (
                    <div className="o-series-panel-header w-hbox">
                        <div className="stills o-mask" style={stillsBgStyle}></div>
                        <div className="info-ctn w-vbox">
                            <h4>{data.title}</h4>
                            <div className="info w-vbox">
                                {this.getActorsEle()}
                                {this.getCateEle()}
                                {this.getRatingEle()}
                                <div className="download-info">
                                    {this.getDownloadBtn('download_all')}
                                    {this.getSubscribeBtn('subscribe')}
                                    {this.subscribeBubbleView}
                                    {this.providersBubbleView}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
        });

        return SeriesHeaderView;
    });
}(this));
