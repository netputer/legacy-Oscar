/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '$',
        'Wording',
        'GA',
        'main/Log',
        'utilities/QueryHelper',
        'utilities/FormatString',
        'utilities/FormatDate',
        'main/models/VideoModel',
        'mixins/FilterNullValues',
        'VideoPlayer',
        'components/ProvidersBubbleView'
    ], function (
        React,
        $,
        Wording,
        GA,
        Log,
        QueryHelper,
        FormatString,
        FormatDate,
        VideoModel,
        FilterNullValues,
        VideoPlayer,
        ProvidersBubbleView
    ) {
        var episodeKey;

        var ItemView = React.createClass({
            componentWillMount : function () {
                this.providersBubbleView = <ProvidersBubbleView
                                                video={this.props.video}
                                                episode={this.props.episode}
                                                source="play"
                                                id="providerItems" />
            },
            updateEpisodeKey : function (key) {
                episodeKey = key;
            },
            showProviderItems : function (key, event) {
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
                    if (boolean && document.getElementsByClassName('item')[key]) {
                        document.getElementsByClassName('item')[key].className = 'item active';
                    } else if (document.getElementsByClassName('item')[key]) {
                        document.getElementsByClassName('item')[key].className = 'item';
                    }
                }.bind(this);

                document.body.addEventListener('click', EventListener, false);
                toggleBubbleState(!this.providersBubbleView.state.providerItemsBubbleShow);

            },
            clickBtn : function () {
                var video = this.props.video.toJSON();
                var episode = this.props.episode;

                // if (this.props.episode.playInfo[0].params && this.props.episode.playInfo[0].params.html5) {
                //     VideoPlayer.show(this.props.episode.playInfo[0].params.html5);
                // } else {
                //     VideoPlayer.show(this.props.episode.playInfo[0].url);
                // }
                var $a = $('<a>').attr({
                    href : episode.playInfo[0].url.indexOf('?') >= 0 ? episode.playInfo[0].url + '&ref=wdj2' : episode.playInfo[0].url + '?ref=wdj2',
                    target : '_default'
                })[0].click();

                Log.consume({type : 'online_play', source : 'manual'}, episode);



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
                        client : JSON.stringify({
                            type : 'windows'
                        }),
                        resource : JSON.stringify({
                            videoId : episode.video_id,
                            videoEpisodeId : episode.id,
                            provider : episode.playInfo[0].title,
                            url : episode.playInfo[0].url
                        })
                    }
                });
            },
            render : function () {
                var episode = this.props.episode;
                var count;

                var style = {
                    display : (this.props.key < 10 || this.props.countEpisodes <= 30 || this.props.key >= this.props.countEpisodes - 5 || this.props.key >= this.props.countEpisodes - this.props.expendIndex * 20 + 15) ? 'inline-block' : 'none'
                };

                if (episode.episodeNum) {
                    count = FormatString(Wording.EPISODE_NUM, episode.episodeNum);
                } else {
                    count = FormatDate('第MM-dd期', episode.episodeDate);
                }
                if (!episode.playInfo || episode.playInfo.length === 0 || episode.playInfo[0].url === undefined) {
                    return (
                        <li className="item" style={style}>
                            <button disabled onClick={this.clickBtn} className="button w-btn w-btn-mini w-btn-primary">
                                {count}
                            </button>
                        </li>
                    );
                } else if (episode.playInfo.length > 1) {
                    return (
                        <li className="item" style={style}>
                            <div className="o-btn-group">
                                <button className="button w-btn w-btn-mini w-btn-primary" onClick={this.clickBtn}>
                                    {count}
                                    <span className="size w-text-info bubble-download-tips w-wc"><em>来源: {episode.playInfo[0].title}</em></span>
                                </button>
                                <button name="more-provider" className="w-btn w-btn-primary w-btn-mini more-provider" onMouseEnter={this.updateEpisodeKey.bind(this, this.props.key)} onClick={this.showProviderItems.bind(this, this.props.key)}>
                                    <span className="arrow"></span>
                                </button>
                                {this.providersBubbleView}
                            </div>
                        </li>
                    );
                } else {
                    return (
                        <li className="item" style={style}>
                            <button onClick={this.clickBtn} className="button w-btn w-btn-mini w-btn-primary">
                                {count}
                            </button>
                        </li>
                    );
                }
            }
        });




        var PlayListView = React.createClass({
            getInitialState : function () {
                return {
                    expendIndex : 1,
                    origin : this.props.origin,
                    video : new VideoModel(FilterNullValues.filterNullValues.call(FilterNullValues, this.props.origin))
                };
            },
            componentWillReceiveProps : function (newProps) {
                if (newProps.origin.id) {
                    this.setState({
                        video : newProps.video,
                        origin : newProps.origin
                    });
                }
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
                                expendIndex={this.state.expendIndex} />;
                }, this);

                return listItems;
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
            render : function () {
                var episode = this.props.video.get('videoEpisodes');

                return (
                    <div className="o-button-list-ctn">
                        <ul className="list-ctn" ref="ctn">
                            {this.createList(episode, 0, 10)}
                            {episode.length > this.state.expendIndex * 20 - 5 && episode.length > 30 && <li className="load-more"><hr /><span onClick={this.clickExpend} className="link">{Wording.LOAD_MORE}</span></li>}
                            {this.createList(episode, 10, episode.length)}
                        </ul>
                    </div>
                );
            }
        });

        return PlayListView;
    });
}(this));
