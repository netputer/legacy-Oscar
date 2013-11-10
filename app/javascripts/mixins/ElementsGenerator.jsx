/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        '_',
        'Wording',
        'GA',
        'main/DownloadHelper',
        'utilities/FormatString',
        'components/SubscribeBubbleView'
    ], function (
        React,
        _,
        Wording,
        GA,
        DownloadHelper,
        FormatString,
        SubscribeBubbleView
    ) {

        var ElementsGenerator = {

            clickButtonDownload : function (source, video) {
                DownloadHelper.download(this.props.video.get('videoEpisodes'));
                if (this.props.subscribed !== -2) {
                    this.showSubscribeBubble('download_all', video);
                }
                GA.log({
                    'event' : 'video.download.action',
                    'action' : 'btn_click',
                    'pos' : source,
                    'video_id' : this.props.video.id,
                    'video_source' : this.props.video.get('videoEpisodes')[0].downloadUrls !== undefined ? this.props.video.get('videoEpisodes')[0].downloadUrls[0].providerName : ''
                });
            },
            showSubscribeBubble : function (source, video) {
                if (this.props.subscribed === 0) {
                    this.bubbleView.setState({
                        show : true,
                        source : source
                    });
                    if (source === 'subscribe') {
                        this.bubbleView.doSubscribe(video, source);
                    }

                    GA.log({
                        'event' : 'video.misc.action',
                        'action' : 'subscribe_popup',
                        'type' : 'display',
                        'pos' : source,
                        'video_id' : this.props.video.id
                    });
                } else {
                    if (source === 'subscribe') {
                        this.bubbleView.doUnsubscribe(video);
                    }
                }
            },
            mouseEvent : function (evt) {
                if (evt === 'onMouseEnter' && this.props.subscribed === 1) {
                    this.subscribeCallback.call(this, -1);
                } else if (evt == 'onMouseLeave' && this.props.subscribed === -1) {
                    this.subscribeCallback.call(this, 1);
                }
            },
            getProviderEle : function () {
                var text = this.props.video.get('providerNames').join(' / ');
                return <span className="provider w-wc w-text-info">{Wording.PROVIDERNAMES_LABEL + (text || Wording.INTERNET)}</span>
            },
            getDownloadBtn : function (source) {
                var text = '';
                switch (this.props.video.get('type')) {
                case 'MOVIE':
                    text = Wording.DOWNLOAD;
                    break;
                case 'TV':
                case 'VARIETY':
                case 'COMIC':
                    text = Wording.DOWNLOAD_ALL;
                    break;
                }

                return <button className="button-download w-btn w-btn-primary" onClick={this.clickButtonDownload.bind(this, source, this.props.video.get('subscribeUrl'))}>{text}</button>
            },
            getSubscribeBtn : function (source) {
                var text;
                if (this.props.video.get('subscribeUrl') === undefined || this.props.subscribed === -2) {
                    return false;
                }
                if (this.props.subscribed === 1) {
                    text = Wording.SUBSCRIBING;
                } else if (this.props.subscribed === -1) {
                    text = Wording.UNSUBSCRIBE;
                } else {
                    text = Wording.SUBSCRIBE;
                }

                return <button class="button-subscribe w-btn" onClick={this.showSubscribeBubble.bind(this, 'subscribe', this.props.video)} onMouseEnter={this.mouseEvent.bind(this, 'onMouseEnter')} onMouseLeave={this.mouseEvent.bind(this, 'onMouseLeave')}>{text}</button>
            },
            getActorsEle : function () {
                var text = '';
                var video = this.props.video;
                if (video.get('type') === 'VARIETY') {
                    text = Wording.PRESENTER_LABEL + video.get('presenters');
                } else {
                    text = Wording.ACTORS_LABEL + video.get('actors');
                }

                return <div className="actors w-text-secondary w-wc">{text}</div>;
            },
            getCateEle : function () {
                var text = '';
                var data = this.props.video.toJSON();
                switch (this.props.video.get('type')) {
                case 'VARIETY':
                    text = data.categories;
                    break;
                case 'TV':
                case 'MOVIE':
                case 'COMIC':
                    text = data.categories + ' / ' + FormatString(Wording.YEAR, data.year);
                    break;
                }

                return <div className="w-text-secondary w-wc">{text}</div>;
            },
            getRatingEle : function () {
                var ele;
                var data = this.props.video.toJSON();
                if (data.rating !== Wording.NO_RATING) {
                    ele = <span className="h4">{data.rating}</span>;
                } else {
                    ele = data.rating;
                }

                return <div className="w-text-secondary w-wc">{Wording.RATING_LABEL}{ele}</div>;
            }
        };

        return ElementsGenerator;
    });
}(this));
