/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        '_',
        '$',
        'Wording',
        'Account',
        'mixins/BubbleView',
        'GA'
    ], function (
        React,
        _,
        $,
        Wording,
        Account,
        BubbleView,
        GA
    ) {

        var isLogin = Account.get('isLogin');

        Account.on('change', function() {
            isLogin = Account.get('isLogin');
        });

        var SubscribeBubbleView = React.createClass({
            mixins : [BubbleView],
            doSubscribe : function (video, source) {

                if (!isLogin) {
                    Account.loginAsync();
                    return false;
                }

                var uri;
                uri = typeof video === 'object' ? video.get('subscribeUrl') : this.props.video.get('subscribeUrl');

                $.ajax({
                    url : 'http://feed.wandoujia.com/api/v1/subscription/add',
                    data : {
                        uri : uri
                    },
                    complete : function (xhr) {
                        if (xhr.status === 200) {
                            this.props.subscribeHandler.call(this, 1);
                            if (source !== 'subscribe') {
                                this.setState({
                                    show : false
                                });
                            }
                            GA.log({
                                'event' : 'video.misc.action',
                                'action' : 'subscribe_popup',
                                'type' : 'subscribe',
                                'pos' : source !== undefined ? source : 'episode',
                                'video_id' : typeof video === 'object' ? video.id : this.props.video.id
                            });

                        }
                    }.bind(this)
                });

            },
            doUnsubscribe : function (video) {
                $.ajax({
                    url : 'http://feed.wandoujia.com/api/v1/subscription/remove',
                    data : {
                        uri : video.get('subscribeUrl')
                    },
                    complete : function (xhr) {
                        if (xhr.status === 200) {
                            this.props.subscribeHandler.call(this, 0);
                            this.setState({
                                show : false,
                                source : ''
                            });
                            GA.log({
                                'event' : 'video.misc.action',
                                'action' : 'subscribe_popup',
                                'type' : 'unsubscribe',
                                'pos' :  'subscribe',
                                'video_id' : video.id
                            });
                        }
                    }.bind(this)
                });
            },
            render : function () {
                var className = this.getBubbleClassName('bubble-subscribe')

                if (this.state.source === 'subscribe') {
                    return (
                        <div className={className}>
                            <div class="bubble-inner arrow-subscribe">
                                <h6>自动下载，最新聚集不错过</h6>
                                <p>打开手机追追看后，每次剧集有更新的时候，豌豆荚都会在手机上直接帮您下好，您不必担心错过最新一集。</p>
                                <p>下载仅使用 Wi-Fi 网络，不会话费您的流量。</p>
                                <button class="w-btn w-btn-primary" onClick={this.closeBubble.bind(this, 'ok')}>知道了</button>
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div className={className}>
                            <div class="bubble-inner arrow-subscribe">
                                <h6>自动下载，最新聚集不错过</h6>
                                <p>打开手机追追看后，每次剧集有更新的时候，豌豆荚都会在手机上直接帮您下好，您不必担心错过最新一集。</p>
                                <p>下载仅使用 Wi-Fi 网络，不会话费您的流量。</p>
                                <button class="w-btn w-btn-primary" onClick={this.doSubscribe.bind(this, false)}>追追看</button>
                                <button class="w-btn" onClick={this.closeBubble.bind(this, 'cancel')}>不追</button>
                            </div>
                        </div>
                    );
                }
            }
        });

        return SubscribeBubbleView;
    });
}(this));
