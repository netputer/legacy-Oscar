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
        'main/DownloadHelper'
    ], function (
        React,
        _,
        Backbone,
        Wording,
        GA,
        FormatString,
        FormatDate,
        ReadableSize,
        DownloadHelper
    ) {

        var ItemView = React.createClass({
            render : function () {
                var episode = this.props.episode;
                var hasDownload = !!episode.downloadUrls;

                var count;
                if (episode.episodeNum) {
                    count = FormatString(Wording.EPISODE_NUM, episode.episodeNum);
                } else {
                    count = FormatDate('第MM-dd期', episode.episodeDate);
                }

                if (hasDownload) {
                    return (
                        <li class="item">
                            <button class="button-download w-btn w-btn-mini w-btn-primary" onClick={this.clickDownload}>
                            {count}
                            </button>
                            <span class="size w-text-info w-wc">{ReadableSize(episode.downloadUrls[0].size)}</span>
                        </li>
                    );

                } else {
                    return (
                        <li class="item">
                            <button class="button-download w-btn w-btn-mini w-btn-primary" disabled onClick={this.clickDownload}>
                            {count}
                            </button>
                        </li>
                    );
                }
            },
            clickDownload : function () {
                var episode = this.props.episode;
                if (!!episode.downloadUrls) {
                    DownloadHelper.download([episode]);
                }
                GA.log({
                    'event' : 'video.download.action',
                    'action' : 'btn_click',
                    'pos' : 'episode_list',
                    'video_id' : episode.video_id,
                    'episode_id' : episode.id,
                    'video_source' : episode.downloadUrls[0].providerName
                });
            }
        });

        var DownloadListView = React.createClass({
            getInitialState : function () {
                return {
                    expendIndex : 0
                };
            },
            componentWillReceiveProps : function () {
                this.setState({
                    expendIndex : 0
                });
            },
            render : function () {
                var episode = this.props.video.get('videoEpisodes');

                var style = {
                    'max-height' : 42 * 5 * this.state.expendIndex + 84
                };

                return (
                    <div class="o-download-list-ctn">
                        <h5>{Wording.EPISODE_DOWNLOAD}</h5>
                        <ul class="list-ctn" ref="ctn" style={style}>
                            {this.createList(episode)}
                        </ul>
                        {episode.length > 12 && <span onClick={this.clickExpend} class="link">{Wording.LOAD_MORE}</span>}
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
                var listItems = _.map(videoEpisodes, function (item, i) {
                    return <ItemView episode={item} key={i} />;
                });

                return listItems;
            }
        });

        return DownloadListView;
    });
}(this));
