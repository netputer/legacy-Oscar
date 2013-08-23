/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        'Backbone',
        'utilities/Download',
        'utilities/FormatString'
    ], function (
        React,
        _,
        Backbone,
        Download,
        FormatString
    ) {

        var textEnum = {
            EPISODE_TEXT : '第{0}集',
            SHOW_ALL : '显示全部{0}集'
        };

        var ItemView = React.createClass({
            
            render : function () {
                
                this.index = this.props.index;
                this.episode = this.props.episode;
                
                return (
                    <li class="o-list-item">
                        <button class="w-btn w-btn-mini" onClick={this.download}>
                        {FormatString(textEnum.EPISODE_TEXT, [this.index + 1])}
                        </button>
                    </li>
                );
            },
            download : function () {
                Download.downloadVideo(this.episode);
            }

        });

        var DownloadListView = React.createClass({
            getInitialState : function () {

                var videoEpisodes = this.props.data['videoEpisodes'];
                var displayShowAll = false;
                var containerClass = 'o-list-container';

                if (videoEpisodes.length > 6) {
                    displayShowAll =  true;
                    containerClass += ' mini';
                }

                return {
                    displayShowAll : displayShowAll,
                    containerClass : containerClass
                };
            },
            render : function () {
                
                var videoEpisodes = this.props.data['videoEpisodes'];
                
                return (
                    <div class="o-download-list-container">
                        <p class="w-text-secondary">分集下载</p>
                        <ul class={this.state.containerClass}>
                            {this.createList(videoEpisodes)}
                        </ul>
                        {this.state.displayShowAll && <a onClick={this.showAll} class="w-text-secondary">{FormatString(textEnum.SHOW_ALL, [videoEpisodes.length + 1])}</a>}
                    </div>
                );
            },
            showAll : function () {
                this.setState({
                    containerClass : this.state.containerClass + ' show-all',
                    displayShowAll : false
                });
            },
            createList : function (videoEpisodes) {
                
                var listItems = [];
                for(var i = videoEpisodes.length; i >= 0; i--){
                    listItems.push(<ItemView episode={videoEpisodes[i]} index={i}/>);
                }

                return listItems;
            }
        });

        return DownloadListView;
    });
}(this));