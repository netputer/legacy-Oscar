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
                    show : false,
                    subscribed : -2
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
            isSubscribed : function (statusCode) {
                this.setState({
                    subscribed : statusCode
                });
            },
            render : function () {
                $('body').toggleClass('overflow', this.state.show);

                var style = {
                    height : window.innerHeight
                };

                var className = this.state.show ? 'o-series-panel show' : 'o-series-panel';

                var video = this.props.video;

                if (video) {
                    if (!this.state.loading) {
                        return (
                            <div className={className} style={style} onClick={this.clickCtn} ref="ctn">
                                <div className="o-series-panel-content w-vbox">
                                    <SeriesHeaderView video={video} subscribed={this.state.subscribed} subscribeHandler={this.isSubscribed} />
                                    <div className="body-ctn">
                                        <div className="body">
                                            {video.get('type') !== 'MOVIE' ? <DownloadListView subscribed={this.state.subscribed} video={video} subscribeHandler={this.isSubscribed} /> :　''}
                                            <DescriptionView video={video} />
                                            <StillsView video={video} />
                                            <CommentaryView comments={video.get('marketComments')[0].comments} />
                                        </div>
                                        <ExtraInfoView video={video} />
                                    </div>
                                    <div className="o-close" onClick={this.props.closeDetailPanel} />
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div className={className} style={style} onClick={this.clickCtn} ref="ctn"><LoadingView /></div>
                        );
                    }
                } else {
                    return (
                        <div className={className} style={style} onClick={this.clickCtn} ref="ctn"></div>
                    );
                }
            }
        });

        return SeriesDetailPanelView;
    });
}(this));
