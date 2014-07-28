/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        'Wording',
        'GA',
        'Actions',
        'utilities/FormatString',
        'mixins/ElementsGenerator',
        'components/AppBubbleView',
        'components/ProvidersBubbleView'
    ], function (
        React,
        Wording,
        GA,
        Actions,
        FormatString,
        ElementsGenerator,
        AppBubbleView,
        ProvidersBubbleView
    ) {
        var openFlag = 0;

        var SeriesHeaderView = React.createClass({
            mixins : [ElementsGenerator],
            getInitialState : function () {
                return {
                    appName : ''
                };
            },
            componentWillMount : function () {
                this.providersBubbleView = <ProvidersBubbleView video={this.props.video} showAppBubble={this.showAppBubble} id="providers" />
            },
            componentWillReceiveProps : function (newProps) {
                if (newProps.showSubscribeBubble === 'download_all' && openFlag === 0) {
                    this.showSubscribeBubble(newProps.showSubscribeBubble, this.props.video);
                    openFlag = 1;
                }

                if (newProps.video.get('videoEpisodes').length && this.providersBubbleView.isMounted()) {
                    this.providersBubbleView.setProps({
                        video : newProps.video
                    });
                }
            },
            render : function () {
                var data = this.props.video.toJSON();
                var stillsBgStyle = {
                    'background-image' : 'url(' + (data.cover.s || "") + ')'
                };

                return (
                    <div className="o-series-panel-header w-hbox">
                        <div className="cover o-mask" style={stillsBgStyle}></div>
                        <div className="info-ctn w-vbox">
                            <h4>{data.title}</h4>
                            <div className="info w-vbox">
                                {this.getCateEle()}
                                {this.getEditorComment()}
                                {this.getStars()}
                                <div className="download-info">
                                    {this.getDownloadBtn('download_all')}
                                    {this.providersBubbleView}
                                </div>
                            </div>
                            <a className="w-text-info legal-link" href="http://www.wandoujia.com/video_legal.html" target="_default">版权举报</a>
                        </div>
                    </div>
                );
            }
        });

        return SeriesHeaderView;
    });
}(this));
