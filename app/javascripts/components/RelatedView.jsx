/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        'IO',
        'Actions',
        'Wording',
        'utilities/QueryHelper',
        'components/VideoListView'
    ], function (
        React,
        _,
        IO,
        Actions,
        Wording,
        QueryHelper,
        VideoListView
    ) {
        var RelatedView = React.createClass({
            getInitialState : function () {
                return {
                    actors : [],
                    avatars : [],
                    list : []

                };
            },
            onVideoSelect : function (id) {
                var path = window.location.hash.split('detail/')[0];
                window.location.hash = path + 'detail/' + id;
            },
            render : function () {
                return (
                    <div className="w-wc row row-related">
                        <h5 className="w-text-secondary">{Wording.RELATED_VIDEO}</h5>

                        <VideoListView title=""
                            list={this.props.list}
                            onVideoSelect={this.onVideoSelect}
                            noBigItem={true}
                            source={this.props.source}
                            ref="video-ctn" />
                    </div>
                );
            }
        });

        return RelatedView;
    });
}(this));
