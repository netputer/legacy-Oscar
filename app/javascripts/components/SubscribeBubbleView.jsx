/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        '_',
        '$',
        'Wording',
        'mixins/BubbleView',
        'GA'
    ], function (
        React,
        _,
        $,
        Wording,
        BubbleView,
        GA
    ) {
        var SubscribeBubbleView = React.createClass({
            mixins : [BubbleView],
            doSubscribe : function (uri) {
               var subscribeUrl;
               if (this.state.subscribeUrl !== undefined) {
                    subscribeUrl = this.state.subscribeUrl;
               } else {
                   subscribeUrl = typeof uri === 'string' ? uri : this.props.video.get('subscribeUrl');
               }

                $.ajax({
                    url : 'http://feed.wandoujia.com/api/v1/subscription/add',
                    data : {
                        uri : subscribeUrl
                    },
                    complete : function (xhr) {
                        if (xhr.status === 200) {
                            this.props.subscribeHandler.call(this, 1)
                            if (typeof uri !== 'string') {
                                this.setState({
                                    show : false
                                });
                            }
                        }
                    }.bind(this)
                });

            },
            doUnsubscribe : function (uri) {
                $.ajax({
                    url : 'http://feed.wandoujia.com/api/v1/subscription/remove',
                    data : {
                        uri : uri
                    },
                    complete : function (xhr) {
                        if (xhr.status === 200) {
                            this.props.subscribeHandler.call(this, 0);
                            this.setState({
                                show : false,
                                source : ''
                            });
                        }
                    }.bind(this)
                });
            },
            render : function () {
                var className = this.getBubbleClassName('bubble-subscribe')

                if(this.state.source === 'subscribe') {
                    return (
                        <div className={className}>
                            <div class="bubble-inner arrow-subscribe">
                                <h6>自动下载，最新聚集不错过</h6>
                                <p>打开手机追追看后，每次剧集有更新的时候，豌豆荚都会在手机上直接帮您下好，您不必担心错过最新一集。</p>
                                <p>下载仅使用 Wi-Fi 网络，不会话费您的流量。</p>
                                <button class="w-btn w-btn-primary" onClick={this.closeBubble}>知道了</button>
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
                                <button class="w-btn" onClick={this.closeBubble}>不追</button>
                            </div>
                        </div>
                    );
                }
            }
        });

        return SubscribeBubbleView;
    });
}(this));
