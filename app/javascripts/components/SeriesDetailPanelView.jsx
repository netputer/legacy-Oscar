/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        'components/DescriptionView',
        'components/StillsView',
        'components/DownloadListView',
        'components/SeriesHeaderView',
        'components/CommentaryView',
        'components/ExtraInfoView'
    ], function (
        React,
        DescriptionView,
        StillsView,
        DownloadListView,
        SeriesHeaderView,
        CommentaryView,
        ExtraInfoView
    ) {

        var SeriesDetailPanelView = React.createClass({
            getInitialState : function () {
                return {
                    show : false
                };
            },
            componentDidMount : function () {
                this.setState({
                    show : true
                });
            },
            render : function () {
                $('body').css({
                    overflow : this.state.show ? 'hidden' : 'auto'
                });

                var className = this.state.show ? 'o-series-panel show' : 'o-series-panel';

                var video = this.props.video;

                return (
                    <div class={className}>
                        <div class="o-series-panel-content">
                            <SeriesHeaderView video={video} />
                            <div class="body">
                                <DownloadListView video={video} />
                                <DescriptionView video={video} />
                                <StillsView video={video} />
                                <CommentaryView comments={video.get('marketComments')[0].comments} />
                            </div>
                            <ExtraInfoView video={video} />
                        </div>
                    </div>
                );
            }
        });

        return SeriesDetailPanelView;
    });
}(this));
