/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        'Backbone',
        'Wording',
        'GA',
        'utilities/FormatString',
        'utilities/FormatDate',
        'utilities/ReadableSize',
        'utilities/QueryHelper',
        'main/DownloadHelper',
        'main/models/VideoModel',
        'mixins/FilterNullValues',
        'components/SubscribeBubbleView',
        'components/AppBubbleView',
        'components/ProvidersBubbleView'
    ], function (
        React,
        _,
        Backbone,
        Wording,
        GA,
        FormatString,
        FormatDate,
        ReadableSize,
        QueryHelper,
        DownloadHelper,
        VideoModel,
        FilterNullValues,
        SubscribeBubbleView,
        AppBubbleView,
        ProvidersBubbleView
    ) {
        var episodeKey;

        var flag = 0;

        var ItemView = React.createClass({
            getInitialState : function () {
                return {
                    appName : ''
                };
            },
            componentWillMount : function () {
                this.providersBubbleView = <ProvidersBubbleView
                                                video={this.props.video}
                                                episode={this.props.episode}
                                                showAppBubble={this.showAppBubble}
                                                id="providerItems" />
            },
            updateEpisodeKey : function (key) {
                episodeKey = key;
            },
            showProvidersBubble : function (key, event) {
                var EventListener = function (event) {
                    if ((event.target.className !== 'arrow' && event.target.name !== 'more-provider') || episodeKey !== key) {
                        toggleBubbleState(false);
                    }
                    document.body.removeEventListener('click', EventListener, false);
                };

                var toggleBubbleState = function (boolean) {
                    this.providersBubbleView.setState({
                        providerItemsBubbleShow : boolean
                    });
                    if (boolean && $('.item')) {
                        $('.item').eq(key).addClass('active');
                    } else if ($('.item')) {
                        $('.item').eq(key).removeClass('active');
                    }
                }.bind(this);

                document.body.addEventListener('click', EventListener, false);
                toggleBubbleState(!this.providersBubbleView.state.providerItemsBubbleShow);

            },
            clickPlay : function (url) {
                var $a = $('<a>').attr({
                    href : url.indexOf('?') >= 0 ? url + '&ref=wdj2' : url + '?ref=wdj2',
                    target : '_default'
                })[0].click();
            },
            render : function () {
                var episode = this.props.episode;
                var count;
                var style = {
                    display : this.props.show ? 'inline-block' : 'none'
                };
                if (episode.episodeNum) {
                    count = FormatString(Wording.EPISODE_NUM_SHORTEN, episode.episodeNum);
                } else {
                    count = FormatDate('第MM-dd期', episode.episodeDate);
                }

                if (!episode.downloadUrls && !episode.playInfo) {
                    return (
                        <li className="item" style={style}>
                            <button className="button button-download w-btn w-btn-mini w-btn-primary" disabled onClick={this.clickDownload}>
                                <span className="download-list-text">{count}</span>
                                <span className="size placeholder bubble-download-tips"></span>
                            </button>
                        </li>
                    );
                }
                var downloadSource = episode.downloadUrls ? episode.downloadUrls.length : 0;
                var playSource = episode.playInfo ? episode.playInfo.length : 0;

                if (downloadSource > 1 || (downloadSource === 1 && playSource >= 1)) {
                    return (
                        <li className="item" style={style}>
                            <div className="o-btn-group">
                                <button className="button button-download w-btn w-btn-mini w-btn-primary" onClick={this.clickDownload}>
                                    <span className="download-list-text w-text-thirdly">{count}</span>
                                    <span className="size w-text-info bubble-download-tips w-wc"><em>来源: {episode.downloadUrls[0].providerName}</em> {ReadableSize(episode.downloadUrls[0].size)}</span>
                                </button>
                                <button name="more-provider" className="w-btn w-btn-primary w-btn-mini more-provider" onMouseEnter={this.updateEpisodeKey.bind(this, this.props.key)} onClick={this.showProvidersBubble.bind(this, this.props.key)}>
                                    <span className="arrow"></span>
                                </button>
                                {this.providersBubbleView}
                                <AppBubbleView
                                    key={this.props.key}
                                    video={this.props.video}
                                    episode={this.props.episode}
                                    name={this.state.appName} />
                            </div>
                        </li>
                    );
                } else if (downloadSource === 1) {
                    return (
                        <li className="item" style={style}>
                            <button className="button button-download w-btn w-btn-mini w-btn-primary" onClick={this.clickDownload}>
                                <span className="download-list-text">{count}</span>
                                <span className="size w-text-info bubble-download-tips w-wc"><em>来源: {episode.downloadUrls[0].providerName}</em> {ReadableSize(episode.downloadUrls[0].size)}</span>
                                <AppBubbleView
                                    key={this.props.key}
                                    video={this.props.video}
                                    episode={this.props.episode}
                                    name={this.state.appName} />
                            </button>
                        </li>
                    );
                } else if (playSource > 1) {
                    return (
                        <li className="item" style={style}>
                            <div className="o-btn-group">
                                <button className="button button-play w-btn w-btn-mini" onClick={this.clickPlay.bind(this, episode.playInfo[0].url)}>
                                    <span className="play-list-text">{count}</span>
                                </button>
                                <button name="more-provider" className="w-btn w-btn-primary w-btn-mini more-provider" onClick={this.showProvidersBubble.bind(this, this.props.key)}>
                                    <span className="arrow"></span>
                                </button>
                                {this.providersBubbleView}
                            </div>
                        </li>
                    );
                } else if (playSource === 1) {
                    return (
                        <li className="item" style={style}>
                            <button className="button button-play w-btn w-btn-mini" onClick={this.clickPlay.bind(this, episode.playInfo[0].url)}>
                                <span className="play-list-text">{count}</span>
                            </button>
                        </li>
                    );
                } else {
                    return (
                        <li className="item" style={style}>
                            <button className="button button-download w-btn w-btn-mini w-btn-primary" disabled onClick={this.clickDownload}>
                                <span className="download-list-text">{count}</span>
                                <span className="size placeholder bubble-download-tips"></span>
                                <AppBubbleView
                                    key={this.props.key}
                                    video={this.props.video}
                                    episode={this.props.episode}
                                    name={this.state.appName} />
                            </button>
                        </li>
                    );
                }
            },
            showAppBubble : function (key, info) {
                this.setState({
                    appName : info.providerName
                });

                if ($('.item') && $('.item').eq(key) && $('.item').eq(key).find('.bubble-app')) {
                    $('.item').eq(key).find('.bubble-app').eq(0).show();
                    setTimeout(function () {
                        $('.item').eq(key).find('.bubble-app').eq(0).hide();
                    }, 7000);
                }
            },
            clickDownload : function () {
                var episode = this.props.episode;
                if (!!episode.downloadUrls) {
                    DownloadHelper.download([episode], this.props.video.get('cover').s);
                    for (var i=1; i <= this.props.key && i <= 5; i++) {
                        if (this.props.video.get('videoEpisodes')[i].downloadUrls !== undefined) {
                            if (this.props.key === i) {
                                this.props.clickHandler.call(this, true);
                            } else if (!sessionStorage.getItem(episode.downloadUrls[0].providerName)) {
                                this.showAppBubble(this.props.key, episode.downloadUrls[0]);
                                sessionStorage.setItem(episode.downloadUrls[0].providerName, 'displayed');
                            }
                            break;
                        }
                    }

                    GA.log({
                        'event' : 'video.download.action',
                        'action' : 'btn_click',
                        'pos' : 'episode_list',
                        'video_id' : episode.video_id,
                        'episode_id' : episode.id,
                        'video_source' : episode.downloadUrls[0].providerName,
                        'video_title' : episode.title,
                        'video_type' : this.props.type
                    });
                }

            }
        });


        var DownloadListView = React.createClass({
            getInitialState : function () {
                return {
                    expendIndex : 1,
                    origin : this.props.origin,
                    video : new VideoModel(FilterNullValues.filterNullValues.call(FilterNullValues, this.props.origin))
                };
            },
            componentWillMount : function () {
                this.subscribeBubbleView = <SubscribeBubbleView video={this.props.video} subscribeHandler={this.subscribeCallback} />
            },
            componentWillReceiveProps : function (newProps) {
                if (newProps.origin && newProps.origin.id) {
                    this.setState({
                        video : newProps.video,
                        origin : newProps.origin
                    });
                }
            },
            subscribeCallback : function (statusCode) {
                this.props.subscribeHandler.call(this, statusCode);
            },
            onChangeCheckbox : function (evt) {
                GA.log({
                    'event' : 'video.misc.action',
                    'action' : 'app_promotion_checkbox_clicked',
                    'type' : evt.target.checked
                });
            },
            render : function () {
                var episode = this.state.video.get('videoEpisodes');
                var className = 'list-ctn ' + this.props.video.get('type').toLowerCase();

                return (
                    <div className="w-cf o-button-list-ctn">
                        <ul className={className} ref="ctn">
                            {this.createList(episode)}
                        </ul>
                        <div>
                        </div>
                        {this.subscribeBubbleView}
                    </div>
                );
            },
            clickExpend : function () {
                if (this.state.expendIndex * 20 - 5 < this.state.origin.latestEpisodeNum) {
                    QueryHelper.queryEpisodesAsync(this.props.id, this.state.expendIndex * 20 - 15, 20).done(function (resp) {
                        var origin = this.props.origin;
                        var episodes = origin.videoEpisodes;

                        _.each(resp.videoEpisodes, function (episode) {
                            episodes[episodes.length-episode.episodeNum] = episode;
                        });

                        origin.videoEpisodes = episodes;
                        var videoModle = new VideoModel(FilterNullValues.filterNullValues.call(FilterNullValues, origin));

                        this.setState({
                            origin : origin,
                            video : videoModle
                        });

                    }.bind(this));

                    this.setState({
                        expendIndex : this.state.expendIndex + 1
                    });

                    GA.log({
                        'event' : 'video.misc.action',
                        'action' : 'more_episode_clicked',
                        'video_id' : this.props.video.id,
                        'tab' : 'download'
                    });
                }
            },
            createList : function (videoEpisodes, start, max) {
                var type = this.props.video.get('type');
                var title = this.props.video.get('title');
                var countEpisodes = this.props.video.get('videoEpisodes').length || 0;
                var episodes = videoEpisodes.slice(start || 0, this.props.video.latestEpisodeNum);
                var listItems = _.map(episodes, function (item, i) {
                        return <ItemView
                                    video={this.props.video}
                                    episode={item}
                                    title={title}
                                    countEpisodes={countEpisodes}
                                    show={(item.episodeNum >= this.props.show.split('-')[0] && item.episodeNum <= this.props.show.split('-')[1]) || this.props.show === 'all'}
                                    key={(start || 0) + i}
                                    expendIndex={this.state.expendIndex}
                                    clickHandler={this.showSubscribeBubble}
                                    type={type} />;

                }, this);

                return listItems;
            },
            showSubscribeBubble : function () {
                if (this.props.subscribed !== 0) {
                    return false;
                }
                if (this.subscribeBubbleView.state !== null && !this.subscribeBubbleView.state.show && this.props.video.get('subscribeUrl') !== undefined) {
                    this.subscribeBubbleView.setState({
                        subscribeBubbleShow : true,
                        source : 'episode'
                    });

                    GA.log({
                        'event' : 'video.misc.action',
                        'action' : 'subscribe_popup',
                        'type' : 'display',
                        'pos' : 'download_newest',
                        'video_id' : this.props.video.id
                    });
                }
            }
        });

        return DownloadListView;
    });
}(this));
