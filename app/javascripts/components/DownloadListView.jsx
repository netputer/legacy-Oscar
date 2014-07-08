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
        'main/DownloadHelper',
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
        DownloadHelper,
        SubscribeBubbleView,
        AppBubbleView,
        ProvidersBubbleView
    ) {
        var episodeKey;

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
                                                source="download"
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
                    if (boolean) {
                        document.getElementsByClassName('item')[key].className = 'item active';
                    } else {
                        document.getElementsByClassName('item')[key].className = 'item';
                    }
                }.bind(this);

                document.body.addEventListener('click', EventListener, false);
                toggleBubbleState(!this.providersBubbleView.state.providerItemsBubbleShow);

            },
            render : function () {
                var episode = this.props.episode;
                var count;
                var style = {
                    display : (this.props.key < 10 || this.props.countEpisodes <= 30 || this.props.key >= this.props.countEpisodes - 5 || this.props.key >= this.props.countEpisodes - this.props.expendIndex * 10 + 5) ? 'inline-block' : 'none'
                };
                if (episode.episodeNum) {
                    count = FormatString(Wording.EPISODE_NUM, episode.episodeNum);
                } else {
                    count = FormatDate('第MM-dd期', episode.episodeDate);
                }
                if (!episode.downloadUrls) {
                    return (
                        <li className="item" style={style}>
                            <button className="button button-download w-btn w-btn-mini w-btn-primary" disabled onClick={this.clickDownload}>
                                <span className="download-list-text">{count}</span>
                                <span className="size placeholder bubble-download-tips"></span>
                            </button>
                        </li>
                    );
                }
                var downloadSource = episode.downloadUrls.length;

                if (downloadSource > 1) {
                    return (
                        <li className="item" style={style}>
                            <div className="o-btn-group">
                                <button className="button button-download w-btn w-btn-mini w-btn-primary" onClick={this.clickDownload}>
                                    <span className="download-list-text">{count}</span>
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

                if (document.getElementsByClassName('item')[key] !== undefined && document.getElementsByClassName('item')[key] !== undefined) {
                    document.getElementsByClassName('item')[key].getElementsByClassName('bubble-app')[0].style.display = 'block';
                    setTimeout(function () {
                        document.getElementsByClassName('item')[key].getElementsByClassName('bubble-app')[0].style.display = 'none';
                    }, 7000);
                }
            },
            clickDownload : function () {
                var episode = this.props.episode;
                if (!!episode.downloadUrls) {
                    DownloadHelper.download([episode], this.props.video.get('cover').s);

                    for (var i=0; i <= this.props.key && i <= 5; i++) {
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
                    expendIndex : 1
                };
            },
            componentWillMount : function () {
                this.subscribeBubbleView = <SubscribeBubbleView video={this.props.video} subscribeHandler={this.subscribeCallback} />
            },
            componentWillReceiveProps : function (newProps) {
                this.setState({
                    expendIndex : 1
                });
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
                var episode = this.props.video.get('videoEpisodes');
                return (
                    <div className="o-button-list-ctn">
                        <ul className="list-ctn" ref="ctn">
                            {this.createList(episode, 0, 10)}
                            {episode.length > this.state.expendIndex * 10 + 5 && episode.length > 30 && <li className="load-more"><hr /><span onClick={this.clickExpend} className="link">{Wording.LOAD_MORE}</span></li>}
                            {this.createList(episode, 10, episode.length)}
                        </ul>
                        <div>
                        </div>
                        {this.subscribeBubbleView}
                    </div>
                );
            },
            clickExpend : function () {
                this.setState({
                    expendIndex : this.state.expendIndex + 1
                });

                GA.log({
                    'event' : 'video.misc.action',
                    'action' : 'more_episode_clicked',
                    'video_id' : this.props.video.id,
                    'tab' : 'download'
                });
            },
            createList : function (videoEpisodes, start, max) {
                var type = this.props.video.get('type');
                var title = this.props.video.get('title');
                var countEpisodes = this.props.video.get('videoEpisodes').length;
                var episodes = videoEpisodes.slice(start, max);
                var listItems = _.map(episodes, function (item, i) {
                    return <ItemView
                                    video={this.props.video}
                                    episode={item}
                                    title={title}
                                    countEpisodes={countEpisodes}
                                    key={start + i}
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
