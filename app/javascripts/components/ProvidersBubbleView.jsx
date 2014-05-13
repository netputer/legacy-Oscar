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
        'utilities/ReadableSize',
        'GA'
    ], function (
        React,
        _,
        $,
        Wording,
        BubbleView,
        DownloadHelper,
        ReadableSize,
        GA
    ) {
        var ProvidersBubbleView = React.createClass({
            mixins : [BubbleView],
            downloadFromProvider : function (url) {
                var icon = this.props.video.get('cover').s;
                if (this.props.episode) {
                    var index = this.props.video.get('videoEpisodes').indexOf(this.props.episode);
                    DownloadHelper.downloadFromProvider(this.props.episode, icon, url, index);
                    if (!sessionStorage.getItem(url.providerName)) {
                        this.props.showAppBubble.call(this, index, url);
                        sessionStorage.setItem(url.providerName, 'displayed');
                    }
                } else {
                    DownloadHelper.downloadFromProvider(this.props.video.get('videoEpisodes')[0], icon, url);
                    if (!sessionStorage.getItem(url.providerName)) {
                        this.props.showAppBubble.call(this, url);
                        sessionStorage.setItem(url.providerName, 'displayed');
                    }
                }

                this.setState({
                    providersBubbleShow : false,
                    providerItemsBubbleShow : false
                });

                GA.log({
                    'event' : 'video.download.action',
                    'action' : 'btn_click',
                    'pos' : 'provider',
                    'video_id' : this.props.video.id,
                    'video_source' : this.props.video.get('videoEpisodes')[0].downloadUrls !== undefined ? this.props.video.get('videoEpisodes')[0].downloadUrls[0].providerName : '',
                    'video_title' : this.props.video.get('title'),
                    'video_type' : this.props.video.get('type'),
                    'video_category' : this.props.video.get('categories'),
                    'video_year' : this.props.video.get('year'),
                    'video_area' : this.props.video.get('region')
                });
            },
            playInProvider : function (url) {
                var $a = $('<a>').attr({
                    href : url,
                    target : '_default'
                })[0].click();

            },
            render : function () {
                var className = this.getBubbleClassName(this.props.id).toLowerCase();
                var items;

                if (this.props.source === 'play') {
                    if (this.props.episode === undefined) {
                        items = this.props.video.get('videoEpisodes')[0].playInfo;
                    } else {
                        items = this.props.episode.playInfo;
                    }
                    var items = _.map(items, function (item, index) {
                            return <li key={index} onClick={this.playInProvider.bind(this, item.url)}>来源: {item.title}</li>
                        }, this);
                } else {
                    if (this.props.episode === undefined) {
                        items = this.props.video.get('videoEpisodes')[0].downloadUrls;
                    } else {
                        items = this.props.episode.downloadUrls;
                    }
                    var items = _.map(items, function (item, index) {
                            return <li key={index} onClick={this.downloadFromProvider.bind(this, item, this.props.video.get('cover').s)}>来源: {item.providerName} <span className="provider-size">{ReadableSize(item.size)}</span></li>
                        }, this);
                }


                return (
                    <div className={className}>
                        <ul>{items}</ul>
                    </div>
                );
            }
        });

        return ProvidersBubbleView;
    });
}(this));
