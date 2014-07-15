/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        'Wording',
        'GA',
        'Actions',
        'utilities/FormatString',
        'mixins/ElementsGenerator',
        'components/SubscribeBubbleView',
        'components/AppBubbleView',
        'components/ProvidersBubbleView'
    ], function (
        React,
        Wording,
        GA,
        Actions,
        FormatString,
        ElementsGenerator,
        SubscribeBubbleView,
        AppBubbleView,
        ProvidersBubbleView
    ) {

        var openFlag = 0;

        var SeriesHeaderView = React.createClass({
            mixins : [ElementsGenerator],
            getInitialState : function () {
                return {
                    appName : ''
                };
            },
            componentWillMount : function () {
                this.subscribeBubbleView = <SubscribeBubbleView video={this.props.video} subscribeHandler={this.subscribeCallback} />
                this.providersBubbleView = <ProvidersBubbleView video={this.props.video} showAppBubble={this.showAppBubble} id="providers" />
            },
            componentDidMount : function () {
                if (this.props.video.get('subscribeUrl') !== undefined) {
                    $.ajax({
                        url : Actions.actions.SUBSCRIBE_CHECK,
                        xhrFields : {
                            withCredentials : true
                        },
                        data : {
                            uri : this.props.video.get('subscribeUrl'),
                            user : 'device_only'
                        },
                        success : function (data) {
                            if (data === 'true') {
                                this.props.subscribeHandler.call(this, 1);
                            } else {
                                this.props.subscribeHandler.call(this, 0);

                                GA.log({
                                    'event' : 'video.misc.action',
                                    'action' : 'subscribe_button',
                                    'type' : 'display',
                                    'pos' : 'subscribe_button',
                                    'video_id' : this.props.video !== undefined ? this.props.video.id : '',
                                    'video_source' : this.props.video.get('videoEpisodes')[0].downloadUrls !== undefined ? this.props.video.get('videoEpisodes')[0].downloadUrls[0].providerName : '',
                                    'video_title' : this.props.video.get('title'),
                                    'video_type' : this.props.video.get('type'),
                                    'video_category' : this.props.video.get('categories'),
                                    'video_year' : this.props.video.get('year'),
                                    'video_area' : this.props.video.get('region')
                                });
                            }
                        }.bind(this),
                        error : function () {
                            this.props.subscribeHandler.call(this);
                        }.bind(this)
                    });
                } else {
                    this.props.subscribeHandler.call(this);
                }
            },
            componentWillReceiveProps : function (newProps) {
                if (newProps.showSubscribeBubble === 'download_all' && openFlag === 0) {
                    this.showSubscribeBubble(newProps.showSubscribeBubble, this.props.video);
                    openFlag = 1;
                }

                if (newProps.video.get('videoEpisodes').length) {
                    this.providersBubbleView.setProps({
                        video : newProps.video
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
                                    {this.getPlayBtn()}
                                    {this.getSubscribeBtn('subscribe')}
                                    {this.subscribeBubbleView}
                                    {this.providersBubbleView}
                                </div>
                            </div>
                            <a className="w-text-info legal-link" href="http://www.wandoujia.com/video_legal.html" target="_default">版权举报</a>
                        </div>
                    </div>
                );
            }
        });

        return SeriesHeaderView;
    });
}(this));
