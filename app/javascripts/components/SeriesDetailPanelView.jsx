/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        '$',
        '_',
        'components/DescriptionView',
        'components/StillsView',
        'components/DownloadListView',
        'components/SeriesHeaderView',
        'components/CommentaryView',
        'components/ExtraInfoView',
        'components/LoadingView'
    ], function (
        React,
        $,
        _,
        DescriptionView,
        StillsView,
        DownloadListView,
        SeriesHeaderView,
        CommentaryView,
        ExtraInfoView,
        LoadingView
    ) {

        var SeriesDetailPanelView = React.createClass({
            getInitialState : function () {
                return {
                    show : false
                };
            },
            componentDidMount : function () {
                $(window).on('resize', _.throttle(function () {
                    $(this.refs.ctn.getDOMNode()).css({
                        height : window.innerHeight,
                        top : window.scrollY
                    });
                }.bind(this), 50));
            },
            clickCtn : function (evt) {
                if (evt.nativeEvent.srcElement.contains(this.refs.ctn.getDOMNode())) {
                    this.props.closeDetailPanel()
                }
            },
            render : function () {
                $('body').toggleClass('overflow', this.state.show);

                var style = {
                    height : window.innerHeight
                };

                var className = this.state.show ? 'o-series-panel show' : 'o-series-panel';

                var video = this.props.video;

                if (video && !this.state.loading) {
                    return (
                        <div class={className} style={style} onClick={this.clickCtn} ref="ctn">
                            <div class="o-series-panel-content w-vbox">
                                <SeriesHeaderView video={video} />
                                <div class="body-ctn">
                                    <div class="body">
                                        {video.get('type') !== 'MOVIE' ? <DownloadListView video={video} /> :　''}
                                        <DescriptionView video={video} />
                                        <StillsView video={video} />
                                        <CommentaryView comments={video.get('marketComments')[0].comments} />
                                    </div>
                                    <ExtraInfoView video={video} />
                                </div>
                                <div class="o-close" onClick={this.props.closeDetailPanel} />
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div class={className} style={style} onClick={this.clickCtn} ref="ctn"><LoadingView /></div>
                    );
                }
            }
        });

        return SeriesDetailPanelView;
    });
}(this));
