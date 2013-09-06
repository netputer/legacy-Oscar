/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        'Backbone',
        'Wording',
        'utilities/FormatString',
        'utilities/ReadableSize',
        'main/DownloadHelper'
    ], function (
        React,
        _,
        Backbone,
        Wording,
        FormatString,
        ReadableSize,
        DownloadHelper
    ) {

        var TEXT_ENUM = {
            EPISODE_TEXT : '第 {1} 集'
        };

        var ItemView = React.createClass({
            render : function () {
                var episode = this.props.episode;
                var hasDownload = !!episode.downloadUrls;

                if (hasDownload) {
                    return (
                        <li class="item">
                            <button class="button-download w-btn w-btn-mini" onClick={this.clickDownload}>
                            {FormatString(TEXT_ENUM.EPISODE_TEXT, episode.episodeNum)}
                            </button>
                            <span class="size w-text-info w-wc">{ReadableSize(episode.downloadUrls[0].size)}</span>
                        </li>
                    );

                } else {
                    return (
                        <li class="item">
                            <button class="button-download w-btn w-btn-mini disabled" onClick={this.clickDownload}>
                            {FormatString(TEXT_ENUM.EPISODE_TEXT, episode.episodeNum)}
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
            }
        });

        var DownloadListView = React.createClass({
            getInitialState : function () {
                return {
                    expendIndex : 0
                };
            },
            render : function () {
                var episode = this.props.video.get('videoEpisodes');

                var style = {
                    'max-height' : 42 * 5 * this.state.expendIndex + 84
                };

                return (
                    <div class="o-download-list-ctn">
                        <h5>分集下载</h5>
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
