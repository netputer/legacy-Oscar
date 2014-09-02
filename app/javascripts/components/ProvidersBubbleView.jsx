/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        '_',
        '$',
        'Wording',
        'main/Log',
        'mixins/BubbleView',
        'main/DownloadHelper',
        'utilities/ReadableSize',
        'GA'
    ], function (
        React,
        _,
        $,
        Wording,
        Log,
        BubbleView,
        DownloadHelper,
        ReadableSize,
        GA
    ) {
        var ProvidersBubbleView = React.createClass({
            mixins : [BubbleView],
            downloadFromProvider : function (url) {
                var icon = this.props.video.get('cover').s;
                var index = this.props.video.get('videoEpisodes').indexOf(this.props.episode);
                if (this.props.episode) {
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

                index = !this.props.episode ? 0 : index;

                GA.log({
                    'event' : 'video.download.action',
                    'action' : 'btn_click',
                    'pos' : 'provider',
                    'video_id' : this.props.video.id,
                    'video_source' : this.props.video.get('videoEpisodes')[index].downloadUrls !== undefined ? this.props.video.get('videoEpisodes')[index].downloadUrls[0].providerName : '',
                    'video_title' : this.props.video.get('title'),
                    'video_type' : this.props.video.get('type'),
                    'video_category' : this.props.video.get('categories'),
                    'video_year' : this.props.video.get('year'),
                    'video_area' : this.props.video.get('region')
                });
            },
            playInProvider : function (item) {
                var url = item.url;

                if (!url) {
                    return false;
                }

                var $a = $('<a>').attr({
                    href : url.indexOf('?') >= 0 ? url + '&ref=wdj2' : url + '?ref=wdj2',
                    target : '_default'
                })[0].click();

                var episode = {
                    providerName : item.title,
                    id : this.props.video.id,
                    video_id : ''
                };

                Log.consume({type : 'online_play', source : 'manual'}, episode);
            },
            render : function () {
                var className = this.getBubbleClassName(this.props.id).toLowerCase();
                var playInfo;
                var downloadInfo;

                    if (this.props.episode === undefined) {
                        playInfo = this.props.video.get('videoEpisodes')[0] ? this.props.video.get('videoEpisodes')[0].playInfo : [];
                    } else {
                        playInfo = this.props.episode.playInfo;
                    }
                    var playItems = _.map(playInfo, function (item, index) {
                            if (item.url) {
                                return <li key={index} onClick={this.playInProvider.bind(this, item)}>{item.title} {Wording.PLAY}</li>
                            }
                        }, this);


                    if (this.props.episode === undefined) {
                        downloadInfo = this.props.video.get('videoEpisodes').length && this.props.video.get('videoEpisodes')[0] ? this.props.video.get('videoEpisodes')[0].downloadUrls : [];
                    } else {
                        downloadInfo = this.props.episode.downloadUrls;
                    }
                    var downloadItems = _.map(downloadInfo, function (item, index) {
                            return <li key={index} onClick={this.downloadFromProvider.bind(this, item, this.props.video.get('cover').s)}>{item.providerName}{Wording.DOWNLOAD} <span className="provider-size">{ReadableSize(item.size)}</span></li>
                        }, this);


                    var getHr = function () {
                        if (downloadItems.length && downloadItems[0] && playItems.length && playItems[0]) {
                            return (
                                <hr />
                            );
                        }
                    };

                return (
                    <div className={className}>
                        <ul>{downloadItems}</ul>
                        {getHr()}
                        <ul>{playItems}</ul>
                    </div>
                );
            }
        });

        return ProvidersBubbleView;
    });
}(this));
