/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '$',
        'IO',
        'GA',
        'Wording',
        'main/DownloadHelper',
        'utilities/ReadableSize',
        'mixins/PopupView'

    ], function (
        React,
        $,
        IO,
        GA,
        Wording,
        DownloadHelper,
        ReadableSize,
        PopupView
    ) {

        var getData = function (episodes, type) {
            var size = 0;
            var count = 0;

            if (episodes) {
                _.each(episodes, function (episode) {
                    if (episode.downloadUrls !== undefined) {
                        size += episode.downloadUrls[0].size;
                        count++;
                    }
                });
            }
            if (type === 'size') {
                return ReadableSize(size);
            } else {
                return count;
            }
        };

        var DownloadComfirmView = React.createClass({
            mixins : [PopupView],
            getInitialState : function () {
                return {
                    episodes : getData(this.props.video.get('videoEpisodes'), 'episodes'),
                    size : getData(this.props.video.get('videoEpisodes'), 'size')
                }
            },
            componentWillReceiveProps : function (newProps) {
                if (newProps.video.get('videoEpisodes').length) {
                    this.setState({
                        episodes : getData(newProps.video.get('videoEpisodes'), 'episodes'),
                        size : getData(newProps.video.get('videoEpisodes'), 'size')
                    });
                }
            },
            clickButton : function (flag) {
                if (!!flag) {
                    DownloadHelper.download(this.props.video.get('videoEpisodes'), this.props.video.get('cover').s);
                }
                this.props.confirmCallback.call(this, flag, true);
                
                GA.log({
                    'event' : 'video.misc.action',
                    'action' : 'download_all_confirmation',
                    'type' : !!flag ? 'ok' : 'cancel',
                    'video_id' : this.props.video.id,
                    'video_source' : this.props.video.get('videoEpisodes')[0] && this.props.video.get('videoEpisodes')[0].downloadUrls !== undefined ? this.props.video.get('videoEpisodes')[0].downloadUrls[0].providerName : '',
                    'video_title' : this.props.video.get('title'),
                    'video_type' : this.props.video.get('type'),
                    'video_category' : this.props.video.get('categories'),
                    'video_year' : this.props.video.get('year'),
                    'video_area' : this.props.video.get('region')
                });
            },
            render : function () {
                var style = {
                    display : !this.props.showConfirm ? 'none' : 'block'
                };

                return (
                    <div className="download-confirm popup" style={style}>
                        <div className="popup-window">
                            <h2 className="w-text-secondary">全部离线缓存</h2>
                            <p className="w-text-thirdly">将开始离线缓存所有 {this.state.episodes} 集，共 {this.state.size}，是否继续？</p>
                            <button className="w-btn w-btn-disabled" onClick={this.clickButton.bind(this, 0)}>取消</button>
                            <button className="w-btn w-btn-primary" onClick={this.clickButton.bind(this, 1)}>继续</button>
                        </div>
                    </div>
                );
            }
        });
        return DownloadComfirmView;
    });
}(this));
