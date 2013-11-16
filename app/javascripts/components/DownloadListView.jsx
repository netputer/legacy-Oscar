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

        var ItemView = React.createClass({
            componentWillMount : function () {
                this.providersBubbleView = <ProvidersBubbleView video={this.props.video} episode={this.props.episode} id="providerItems" />
            },
            showProviderItems : function () {
                clickedProviderArrow = 1;
                if (clickedProviderArrow === 1) {
                    this.providersBubbleView.setState({
                        providerItemsBubbleShow : !(this.providersBubbleView.state.providerItemsBubbleShow)
                    });
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
                        <div className="more-provider" onClick={this.showProviderItems}>
                            <span className="arrow"></span>
                        </div>
                    );
                }.bind(this);
                var count;
                if (episode.episodeNum) {
                    count = FormatString(Wording.EPISODE_NUM, episode.episodeNum);
                } else {
                    count = FormatDate('第MM-dd期', episode.episodeDate);
                }

                if (hasDownload) {
                    return (
                        <li className="item">
                            <button className="button-download w-btn w-btn-mini w-btn-primary" onClick={this.clickDownload}>
                            {count} {episode.downloadUrls.length > 1 ? moreProvider() : ''}
                            </button>
                            <span className="size w-text-info w-wc">{ReadableSize(episode.downloadUrls[0].size)}</span>
                            {episode.downloadUrls.length > 1 ? this.providersBubbleView : ''}
                        </li>
                    );

                } else {
                    return (
                        <li className="item">
                            <button className="button-download w-btn w-btn-mini w-btn-primary" disabled onClick={this.clickDownload}>
                            {count}
                            </button>
                        </li>
                    );
                }
            },
            clickDownload : function () {
                if (clickedProviderArrow === 0) {
                    var episode = this.props.episode;
                    if (['TV', 'COMIC', 'VARIETY'].indexOf(this.props.type) >= 0) {
                        if (this.props.type === 'VARIETY') {
                            episode.title = this.props.title + '_' + FormatString(Wording.EPISODE_NUM_VARIETY, FormatDate('yyyy-MM-dd', episode.episodeDate)) + '_' + episode.id;
                        } else {
                            episode.title = this.props.title + '_' + FormatString(Wording.EPISODE_NUM_SHORTEN, episode.episodeNum) + '_' + episode.id;
                        }
                    }
                    if (!!episode.downloadUrls) {
                        DownloadHelper.download([episode]);
                        if (this.props.key === 0) {
                            this.props.clickHandler.call(this, true);
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
                    expendIndex : 0
                };
            },
            componentWillMount : function () {
                this.subscribeBubbleView = <SubscribeBubbleView video={this.props.video} subscribeHandler={this.subscribeCallback} />
            },
            componentWillReceiveProps : function () {
                this.setState({
                    expendIndex : 0
                });
            },
            subscribeCallback : function (statusCode) {
                this.props.subscribeHandler.call(this, statusCode);
            },
            render : function () {
                var episode = this.props.video.get('videoEpisodes');


                var style = {
                    'max-height' : 42 * 5 * this.state.expendIndex + 84
                };

                return (
                    <div className="o-download-list-ctn">
                        <h5>{Wording.EPISODE_DOWNLOAD}</h5>
                        <ul className="list-ctn" ref="ctn" style={style}>
                            {this.createList(episode)}
                        </ul>
                        {episode.length > 12 && <span onClick={this.clickExpend} className="link">{Wording.LOAD_MORE}</span>}
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
                                clickHandler={this.showSubscribeBubble}
                                type={type} />;
                }.bind(this));

                return listItems;
            },
            showSubscribeBubble : function () {
                if (this.props.subscribed === -2) {
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
