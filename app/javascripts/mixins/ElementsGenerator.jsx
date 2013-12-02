/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        '_',
        'Wording',
        'GA',
        'main/DownloadHelper',
        'utilities/ReadableSize',
        'utilities/FormatString'
    ], function (
        React,
        _,
        Wording,
        GA,
        DownloadHelper,
        ReadableSize,
        FormatString
    ) {

        var clickedProviderArrow = 0;

        var ElementsGenerator = {
            clickButtonDownload : function (source, video) {
                if (clickedProviderArrow === 0) {
                    var installPlayerApp = this.refs !== undefined && this.refs['player-app'].state.checked;

                    DownloadHelper.download(this.props.video.get('videoEpisodes'), installPlayerApp);

                    if (this.props.subscribed !== -2) {
                        this.showSubscribeBubble('download_all', video);
                    }

                    GA.log({
                        'event' : 'video.download.action',
                        'action' : 'btn_click',
                        'pos' : source,
                        'video_id' : this.props.video.id,
                        'video_source' : this.props.video.get('videoEpisodes')[0].downloadUrls !== undefined ? this.props.video.get('videoEpisodes')[0].downloadUrls[0].providerName : '',
                        'video_title' : this.props.video.get('title'),
                        'video_type' : this.props.video.get('type'),
                        'video_category' : this.props.video.get('categories'),
                        'video_year' : this.props.video.get('year'),
                        'video_area' : this.props.video.get('region')
                    });
                }
            },
            showSubscribeBubble : function (source, video) {
                if (this.props.subscribed === 0) {
                    if (source === 'subscribe') {
                        this.subscribeCallback.call(this, 2);
                        this.subscribeBubbleView.doSubscribe(video, source);
                    }

                    if (source !== 'subscribe' || sessionStorage.getItem('subscribe') === null) {
                        this.subscribeBubbleView.setState({
                            subscribeBubbleShow : true,
                            source : source
                        });
                    }

                    GA.log({
                        'event' : 'video.misc.action',
                        'action' : 'subscribe_popup',
                        'type' : 'display',
                        'pos' : source,
                        'video_id' : this.props.video.id,
                        'video_source' : this.props.video.get('videoEpisodes')[0].downloadUrls !== undefined ? this.props.video.get('videoEpisodes')[0].downloadUrls[0].providerName : '',
                        'video_title' : this.props.video.get('title'),
                        'video_type' : this.props.video.get('type'),
                        'video_category' : this.props.video.get('categories'),
                        'video_year' : this.props.video.get('year'),
                        'video_area' : this.props.video.get('region')
                    });
                } else {
                    if (source === 'subscribe') {
                        this.subscribeCallback.call(this, 2);
                        this.subscribeBubbleView.doUnsubscribe(video);
                    }
                }
            },
            mouseEvent : function (evt) {
                if (evt === 'onMouseEnter' && this.props.subscribed === 1) {
                    this.subscribeCallback.call(this, -1);
                } else if (evt === 'onMouseLeave' && this.props.subscribed === -1) {
                    this.subscribeCallback.call(this, 1);
                }
            },
            moreProvider : function () {
                clickedProviderArrow = 1;

                var EventListener = function (event) {
                    if (event.target.className !== 'arrow' && event.target.name !== 'more-provider') {
                        toggleBubbleState(false);
                    }
                    document.body.removeEventListener('click', EventListener, false);
                };

                var toggleBubbleState = function (boolean) {
                    this.providersBubbleView.setState({
                        providersBubbleShow : boolean
                    });
                    if (boolean) {
                        document.getElementById('more-provider').className = 'w-btn w-btn-primary more-provider active';
                    } else {
                        document.getElementById('more-provider').className = 'w-btn w-btn-primary more-provider';
                    }
                }.bind(this);

                if (clickedProviderArrow === 1) {
                    document.body.addEventListener('click', EventListener, false);
                    toggleBubbleState(!this.providersBubbleView.state.providersBubbleShow);
                }

                setTimeout(function () {
                    clickedProviderArrow = 0;
                }, 500);

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

                    if (this.props.video.get('videoEpisodes')[0].downloadUrls.length > 1) {
                        return (
                            <div className="o-btn-group">
                                <button className="button-download w-btn w-btn-primary" onClick={this.clickButtonDownload.bind(this, source)}>
                                    {text}
                                    <span className="size w-text-info bubble-download-tips w-wc"><em>来源: {this.props.video.get('videoEpisodes')[0].downloadUrls[0].providerName}</em> {ReadableSize(this.props.video.get('videoEpisodes')[0].downloadUrls[0].size)}</span>
                                </button>
                                <button id="more-provider" name="more-provider" className="w-btn w-btn-primary more-provider" onClick={this.moreProvider}>
                                    <span className="arrow"></span>
                                </button>
                            </div>

                        );
                    } else {
                        return (
                            <button className="button-download w-btn w-btn-primary" onClick={this.clickButtonDownload.bind(this, source)}>
                                {text}
                                <span className="size w-text-info bubble-download-tips w-wc"><em>来源: {this.props.video.get('videoEpisodes')[0].downloadUrls[0].providerName}</em> {ReadableSize(this.props.video.get('videoEpisodes')[0].downloadUrls[0].size)}</span>
                            </button>
                        );
                    }
                    break;
                case 'TV':
                case 'VARIETY':
                case 'COMIC':
                    text = Wording.DOWNLOAD_ALL;
                    break;
                }

                return (
                    <button className="button-download w-btn w-btn-primary" onClick={this.clickButtonDownload.bind(this, source, this.props.video.get('subscribeUrl'))}>
                        {text}
                    </button>
                );
            },
            clickButtonPlay : function (url) {
                var episode = this.props.video.get('videoEpisodes')[0];
                var video = this.props.video.toJSON();

                var $a = $('<a>').attr({
                    href : url,
                    target : '_default'
                })[0].click();

                GA.log({
                    'event' : 'video.play.action',
                    'action' : 'btn_click',
                    'video_source' : episode.playInfo[0].title,
                    'video_id' : episode.video_id,
                    'episode_id' : episode.id,
                    'video_title' : video.title,
                    'video_type' : video.type,
                    'video_category' : video.categories,
                    'video_year' : video.year,
                    'video_area' : video.region,
                    'video_num' : video.totalEpisodesNum
                });

                $.ajax({
                    url : 'http://oscar.wandoujia.com/api/v1/monitor',
                    data : {
                        event : 'video_play_start',
                        client : {
                            type : 'windows'
                        },
                        resource : {
                            videoId : episode.video_id,
                            videoEpisodeId : episode.id,
                            provider : episode.playInfo[0].title,
                            url : episode.playInfo[0].url
                        }
                    }
                });
            },
            getPlayBtn : function (source) {
                var episodes  = this.props.video.get('videoEpisodes');
                if (this.props.video.get('type') === 'MOVIE' && episodes[0].playInfo.length > 0 && episodes[0].playInfo[0].url !== undefined) {
                    return (
                        <button className="button-play w-btn" onClick={this.clickButtonPlay.bind(this, episodes[0].playInfo[0].url)}>
                            {Wording.PLAY}
                        </button>
                    );

                } else {
                    return ' ';
                }
            },
            getSubscribeBtn : function (source) {
                var text;
                var baseClassName = 'button-subscribe w-btn';
                var className;

                if (this.props.video.get('subscribeUrl') === undefined || this.props.subscribed === -2) {
                    return false;
                }
                if (this.props.subscribed === 1) {
                    className = baseClassName + ' subscribing';
                    text = Wording.SUBSCRIBING;
                } else if (this.props.subscribed === -1) {
                    className = baseClassName + ' w-btn-danger';
                    text = Wording.UNSUBSCRIBE;
                } else if (this.props.subscribed === 2) {
                    className = baseClassName + ' loading';
                    text = Wording.LOADING;
                } else {
                        className = baseClassName;
                    text = Wording.SUBSCRIBE;
                }

                return <button id="button-subscribe" class={className} onClick={this.showSubscribeBubble.bind(this, 'subscribe', this.props.video)} onMouseEnter={this.mouseEvent.bind(this, 'onMouseEnter')} onMouseLeave={this.mouseEvent.bind(this, 'onMouseLeave')}>{text}</button>
            },
            handleChange : function (evt) {
                if (event.target.checked === false) {
                    sessionStorage.setItem('unchecked', 'unchecked');
                } else {
                    sessionStorage.removeItem('unchecked');
                }

                GA.log({
                    'event' : 'video.misc.actions',
                    'action' : 'app_promotion_checkbox_clicked',
                    'type' : evt.target.checked
                });
            },
            getCheckbox : function (name) {
                if (this.props.video.get('type') === 'MOVIE') {
                    return (
                        <label class="download-app">
                            <input class="w-checkbox" ref="player-app" onChange={this.handleChange} type="checkbox" />
                            同时下载视频应用
                        </label>
                    );
                }
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
