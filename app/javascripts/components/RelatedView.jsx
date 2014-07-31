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
        var queryRelated = function (id) {
            var deferred = $.Deferred();

            IO.requestAsync({
                url : Actions.actions.RELATIONS,
                data : {
                    start : 0,
                    max : 5,
                    videoId : id
                 },
                success : deferred.resolve,
                error : deferred.reject
            });

            return deferred.promise();
        };


        var RelatedView = React.createClass({
            getInitialState : function () {
                return {
                    actors : [],
                    avatars : [],
                    list : []

                };
            },
            componentDidMount : function () {
                if (this.props.videoId) {
                    queryRelated(this.props.videoId).done(function (resp) {
                        this.setState({
                            list : resp
                        });
                    }.bind(this));
                }
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
                            list={this.state.list}
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
