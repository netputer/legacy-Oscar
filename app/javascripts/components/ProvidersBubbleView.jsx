/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        '_',
        '$',
        'Wording',
        'mixins/BubbleView',
        'main/DownloadHelper',
        'utilities/ReadableSize',
        'GA'
    ], function (
        React,
        _,
        $,
        Wording,
        BubbleView,
        DownloadHelper,
        ReadableSize,
        GA
    ) {
        var ProvidersBubbleView = React.createClass({
            mixins : [BubbleView],
            downloadFromProvider : function (url) {
                DownloadHelper.downloadFromProvider(url);
                this.setState({
                    providersBubbleShow : false,
                    providerItemsBubbleShow : false
                });
            },
            render : function () {
                var className = this.getBubbleClassName(this.props.id).toLowerCase();
                var urls;
                if (this.props.video !== undefined) {
                    urls = this.props.video.get('videoEpisodes')[0].downloadUrls;
                } else {
                    urls = this.props.episode.downloadUrls;
                }

                var items = _.map(urls, function (url, index) {
                        return <li onClick={this.downloadFromProvider.bind(this, url)}>来源{index+1}: {url.providerName} <span className="provider-size">{ReadableSize(url.size)}</span></li>
                    }.bind(this));

                return (
                    <div className={className}>
                        <ul>{items}</ul>
                    </div>
                );

            }
        });

        return ProvidersBubbleView;
    });
}(this));
