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
        ProvidersBubbleView
    ) {

        var clickedProviderArrow = 0;

        var episodeKey;

        var ItemView = React.createClass({
            componentWillMount : function () {
                this.providersBubbleView = <ProvidersBubbleView video={this.props.video} episode={this.props.episode} id="providerItems" />
            },
            showProviderItems : function (key) {
                clickedProviderArrow = 1;

                var EventListener = function (event) {
                    if ((event.target.className !== 'arrow' && event.target.className !== 'more-provider') || (episodeKey !== key)) {
                        toggleBubbleState(false);
                    }
                    episodeKey = key
                    document.body.removeEventListener('click', EventListener, false);
                };

                var toggleBubbleState = function (boolean) {
                    this.providersBubbleView.setState({
                        providerItemsBubbleShow : boolean
                    });
                }.bind(this);

                if (clickedProviderArrow === 1) {
                    document.body.addEventListener('click', EventListener, false);
                    toggleBubbleState(!this.providersBubbleView.state.providerItemsBubbleShow);
                }

                setTimeout(function () {
                    clickedProviderArrow = 0;
                }, 500);
            },
            render : function () {
                var episode = this.props.episode;
                var hasDownload = !!episode.downloadUrls;
                var moreProvider = function () {
                    return (
                        <div className="more-provider" onClick={this.showProviderItems.bind(this, this.props.key)}>
                            <span className="arrow"></span>
                        </div>
                    );
                }.bind(this);
                var count;
                var style = {
                    display : this.props.key >= this.props.expendIndex * 12 ? 'none' : 'inline-block'
                };
                if (episode.episodeNum) {
                    count = FormatString(Wording.EPISODE_NUM, episode.episodeNum);
                } else {
                    count = FormatDate('第MM-dd期', episode.episodeDate);
                }
                if (hasDownload) {
                    return (
                        <li className="item" style={style}>
                            <button className="button-download w-btn w-btn-mini w-btn-primary" onClick={this.clickDownload}>
                            {count} {episode.downloadUrls.length > 1 ? moreProvider() : ''}
                            </button>
                            <span className="size w-text-info bubble-download-tips w-wc"><em>来源: {episode.downloadUrls[0].providerName}</em> {ReadableSize(episode.downloadUrls[0].size)}</span>
                            {episode.downloadUrls.length > 1 ? this.providersBubbleView : ''}
                        </li>
                    );
                } else {
                    return (
                        <li className="item" style={style}>
                            <button className="button-download w-btn w-btn-mini w-btn-primary" disabled onClick={this.clickDownload}>
                            {count}
                            <span className="size placeholder bubble-download-tips"></span>
                            </button>
                        </li>
                    );
                }
            },
            clickDownload : function () {
                if (clickedProviderArrow === 0) {
                    var episode = this.props.episode;
                    if (!!episode.downloadUrls) {
                        var installPlayerApp = !!document.getElementById('player-app') && document.getElementById('player-app').checked;
                        DownloadHelper.download([episode], installPlayerApp, this.props.key);

                            for (var i=0; i <= this.props.key && i <= 5; i++) {
                                if (this.props.video.get('videoEpisodes')[i].downloadUrls !== undefined) {
                                    if (this.props.key === i) {
                                        this.props.clickHandler.call(this, true);
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
            componentWillReceiveProps : function () {
                this.setState({
                    expendIndex : 1
                });
            },
            subscribeCallback : function (statusCode) {
                this.props.subscribeHandler.call(this, statusCode);
            },
            handleChange : function (event) {
                if (event.target.checked === false) {
                    sessionStorage.setItem('unchecked', 'unchecked');
                    GA.log({
                        'event' : 'video.misc.action',
                        'action' : 'app_promotion_unchecked'
                    });
                } else {
                    sessionStorage.removeItem('unchecked');
                }
            },
            render : function () {
                var episode = this.props.video.get('videoEpisodes');
                if (sessionStorage.getItem('unchecked') !== null) {
                    return (
                        <div className="o-download-list-ctn">
                            <h5>{Wording.EPISODE_DOWNLOAD}</h5>
                            <div className="player-app">
                                <input id="player-app" ref="player-app" onChange={this.handleChange} type="checkbox" />
                                <label htmlFor="player-app">同时下载视频应用</label>
                            </div>
                            <ul className="list-ctn" ref="ctn">
                                {this.createList(episode)}
                            </ul>
                            {episode.length > this.state.expendIndex * 12 && <span onClick={this.clickExpend} className="link">{Wording.LOAD_MORE}</span>}
                            {this.subscribeBubbleView}
                        </div>
                    );
                } else {
                    return (
                        <div className="o-download-list-ctn">
                            <h5>{Wording.EPISODE_DOWNLOAD}</h5>
                            <div className="player-app">
                                <input id="player-app" ref="player-app" onChange={this.handleChange} type="checkbox" />
                                <label htmlFor="player-app">同时下载视频应用</label>
                            </div>
                            <ul className="list-ctn" ref="ctn">
                                {this.createList(episode)}
                            </ul>
                            {episode.length > this.state.expendIndex * 12 && <span onClick={this.clickExpend} className="link">{Wording.LOAD_MORE}</span>}
                            {this.subscribeBubbleView}
                        </div>
                    );
                }
            },
            clickExpend : function () {
                this.setState({
                    expendIndex : this.state.expendIndex + 1
                });

                GA.log({
                    'event' : 'video.misc.action',
                    'action' : 'more_episode_clicked',
                    'video_id' : this.props.video.id
                });
            },
            createList : function (videoEpisodes) {
                var type = this.props.video.get('type');
                var title = this.props.video.get('title');
                var listItems = _.map(videoEpisodes, function (item, i) {
                    return <ItemView
                                video={this.props.video}
                                episode={item}
                                title={title}
                                key={i}
                                expendIndex={this.state.expendIndex}
                                clickHandler={this.showSubscribeBubble}
                                type={type} />;
                }.bind(this));

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
