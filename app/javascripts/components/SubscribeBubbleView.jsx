/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        '_',
        '$',
        'IO',
        'Actions',
        'Wording',
        'mixins/BubbleView',
        'GA'
    ], function (
        React,
        _,
        $,
        IO,
        Actions,
        Wording,
        BubbleView,
        GA
    ) {
        var SubscribeBubbleView = React.createClass({
            mixins : [BubbleView],
            doSubscribe : function (video, source) {
               var uri;
               uri = typeof video === 'object' ? video.get('subscribeUrl') : this.props.video.get('subscribeUrl');

                $.ajax({
                    url : Actions.actions.SUBSCRIBE_ADD,
                    xhrFields: {
                        withCredentials: true
                    },
                    data : {
                        uri : uri,
                        user : 'device_only'
                    },
                    complete : function (xhr) {
                        if (xhr.status === 200) {
                            this.props.subscribeHandler.call(this, 1);
                            if (source !== 'subscribe') {
                                this.setState({
                                    subscribeBubbleShow : false
                                });
                            }

                            GA.log({
                                'event' : source === 'subscribe' ? 'video.common.action' : 'video.misc.action',
                                'action' : source === 'subscribe' ? 'subscribe' : 'subscribe_popup',
                                'type' : 'subscribe',
                                'pos' : source === 'subscribe' ? 'detail' : 'popup',
                                'video_id' : typeof video === 'object' ? video.id : this.props.video.id,
                                'video_title' : typeof video === 'object' ? video.title : this.props.video.title,
                                'video_type' : typeof video === 'object' ? video.type : this.props.video.type,
                                'video_category' : typeof video === 'object' ? video.categories : this.props.video.categories,
                                'video_area' : typeof video === 'object' ? video.region : this.props.video.region
                            });

                        }
                    }.bind(this)
                });
            },
            doUnsubscribe : function (video) {
                $.ajax({
                    url : Actions.actions.SUBSCRIBE_REMOVE,
                    data : {
                        uri : video.get('subscribeUrl'),
                        user : 'device_only'
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    complete : function (xhr) {
                        if (xhr.status === 200) {
                            this.props.subscribeHandler.call(this, 0);
                            this.setState({
                                subscribeBubbleShow : false,
                                source : ''
                            });
                            GA.log({
                                'event' : 'video.common.action',
                                'action' : 'unsubscribe',
                                'pos' :  'detail',
                                'video_id' : video.id,
                                'video_title' : video.title,
                                'video_type' : video.type,
                                'video_category' : video.categories,
                                'video_area' : video.region
                            });
                        }
                    }.bind(this)
                });
            },
            render : function () {
                var className = this.getBubbleClassName('subscribe')

                if (this.state.source === 'subscribe') {
                    return (
                        <div className={className}>
                            <div className="bubble-inner arrow-subscribe">
                                <h6>自动离线缓存，最新剧集不错过</h6>
                                <p>打开手机追追看后，每次剧集有更新的时候，豌豆荚都会在手机上直接帮你下好，你不必担心错过最新一集。</p>
                                <p>离线缓存仅使用 Wi-Fi 网络，不会花费你的流量。</p>
                                <button className="w-btn w-btn-primary" onClick={this.closeBubble.bind(this, 'ok')}>知道了</button>
                            </div>
                        </div>
                    );
                } else  if (this.state.source === 'mouseenter') {
                    return (
                        <div className={className}>
                            <div className="bubble-inner arrow-subscribe">
                                <h6>自动离线缓存，最新剧集不错过</h6>
                                <p>打开手机追追看后，每次剧集有更新的时候，豌豆荚都会在手机上直接帮你下好，你不必担心错过最新一集。</p>
                                <p>离线缓存仅使用 Wi-Fi 网络，不会花费你的流量。</p>
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div className={className}>
                            <div className="bubble-inner arrow-subscribe">
                                <h6>自动离线缓存，最新剧集不错过</h6>
                                <p>打开手机追追看后，每次剧集有更新的时候，豌豆荚都会在手机上直接帮你下好，你不必担心错过最新一集。</p>
                                <p>离线缓存仅使用 Wi-Fi 网络，不会花费你的流量。</p>
                                <button className="w-btn w-btn-primary" onClick={this.doSubscribe.bind(this, false)}>追追看</button>
                                <button className="w-btn" onClick={this.closeBubble.bind(this, 'cancel')}>不追</button>
                            </div>
                        </div>
                    );
                }
            }
        });

        return SubscribeBubbleView;
    });
}(this));
