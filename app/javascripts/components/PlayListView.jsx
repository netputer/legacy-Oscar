/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '$',
        'Wording',
        'GA',
        'utilities/FormatString',
        'utilities/FormatDate',
        'VideoPlayer'
    ], function (
        React,
        $,
        Wording,
        GA,
        FormatString,
        FormatDate,
        VideoPlayer
    ) {
        var ItemView = React.createClass({
            clickBtn : function () {
                var video = this.props.video.toJSON();
                var episode = this.props.episode;
                // if (this.props.episode.playInfo[0].params && this.props.episode.playInfo[0].params.html5) {
                //     VideoPlayer.show(this.props.episode.playInfo[0].params.html5);
                // } else {
                //     VideoPlayer.show(this.props.episode.playInfo[0].url);
                // }
                var $a = $('<a>').attr({
                    href : episode.playInfo[0].url,
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
            render : function () {
                var episode = this.props.episode;
                var count;

                var style = {
                    display : this.props.key >= this.props.expendIndex * 10 ? 'none' : 'inline-block'
                };

                if (episode.episodeNum) {
                    count = FormatString(Wording.EPISODE_NUM, episode.episodeNum);
                } else {
                    count = FormatDate('第MM-dd期', episode.episodeDate);
                }

                if (!episode.playInfo || episode.playInfo.length === 0) {
                    return (
                        <li className="item" style={style}>
                            <button disabled onClick={this.clickBtn} className="button w-btn w-btn-mini w-btn-primary">
                                {count}
                            </button>
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
                    expendIndex : 1
                };
            },
            componentWillReceiveProps : function () {
                this.setState({
                    expendIndex : 1
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
                                expendIndex={this.state.expendIndex} />;
                }, this);

                return listItems;
            },
            clickExpend : function () {
                this.setState({
                    expendIndex : this.state.expendIndex + 1
                });

                GA.log({
                    'event' : 'video.misc.action',
                    'action' : 'more_episode_clicked',
                    'video_id' : this.props.video.id,
                    'tab' : 'play'
                });
            },
            render : function () {
                var episode = this.props.video.get('videoEpisodes');

                return (
                    <div class="o-button-list-ctn">
                        <ul className="list-ctn" ref="ctn">
                        {this.createList(this.props.video.get('videoEpisodes'))}
                        </ul>
                        {episode.length > this.state.expendIndex * 10 && <span onClick={this.clickExpend} className="link">{Wording.LOAD_MORE}</span>}
                    </div>
                );
            }
        });

        return PlayListView;
    });
}(this));
