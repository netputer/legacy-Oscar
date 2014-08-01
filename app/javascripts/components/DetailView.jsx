/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        'IO',
        'Actions',
        'Wording',
        'utilities/FormatString',
        'utilities/FormatDate',
        'utilities/QueryHelper',
        'components/LoadingView',
        'components/DescriptionView',
        'components/StillsView'
    ], function (
        React,
        _,
        IO,
        Actions,
        Wording,
        FormatString,
        FormatDate,
        QueryHelper,
        LoadingView,
        DescriptionView,
        StillsView
    ) {

        var getShortAsync = function (id) {
            var deferred = $.Deferred();

            IO.requestAsync({
                url : Actions.actions.RELATIONS + '?videoId=' + id,
                data : {
                    start : 0,
                    max : 1,
                    relation : 'SHORT_PREVIEW'
                },
                success : deferred.resolve,
                error : deferred.reject,
                cache : true,
                ifModified : false,
            });

            return deferred.promise();
        };

        var SeriesView = React.createClass({
            getInitialState : function () {
                return {
                    loadingActors : true,
                    shortFilms : []
                };
            },
            componentWillReceiveProps : function (newProps) {

                if (newProps.actors && newProps.actors.length && newProps.avatars) {
                    this.setState({
                        loadingActors : false
                    });
                }
            },
            componentWillMount : function () {
                var video = this.props.video || {};

                if (video.id && video.get('type') === 'MOVIE') {
                    getShortAsync(video.id).done(function (resp) {
                        this.setState({
                            shortFilms : resp
                        });
                    }.bind(this));
                }
            },
            clickActor : function (actor) {
                $('<a>').attr({
                    href : 'person.html?name=' + actor
                })[0].click();
            },
            getActorsWithAvatar : function () {
                return _.map(this.props.actors, function (actor, index) {
                    if (index < 6) {
                        var style = {
                            'background-image' : 'url(' + (this.props.avatars[actor] || '/images/default-avatar.png') + ')'
                        };

                        return (
                            <div className="actor" style={style} onClick={this.clickActor.bind(this, actor)}>
                                <span>{actor}</span>
                            </div>                        
                        );
                    }
                }.bind(this));
            },
            createEle : function (name, data) {
                if (data) {
                    return (
                        <p className="w-text-info">{Wording[name]}: <span className="w-text-thirdly">{data}</span></p>
                    );
                }
            },
            getActors : function () {
                var video = this.props.video || {};
                if (this.props.actors.length && !this.state.loadingActors) {
                    return (
                        <div className="w-wc actors">
                            <h5>{Wording.ACTORS_LABEL}</h5>
                            {this.getActorsWithAvatar(video)}
                        </div>
                    );
                } else if (!this.props.actors.length) {
                    return (
                        <div />
                    );
                } else {
                    return (
                        <LoadingView show={this.state.loadingActors} />
                    );
                }
            },
            render : function () {
                var video = this.props.video || {};

                return (
                    <div className="w-wc row row-detail">
                        {this.getActors()}
                        <DescriptionView video={this.props.video} />
                        <div className="detail-info">
                            <h5 className="w-text-secondary">{Wording.OTHER_INFO}</h5>
                            {this.createEle('CATEGORY', video.get('categories'))}
                            {video.get('releaseDate') ? this.createEle('RELEASE_DATE', FormatDate('yyyy-MM-dd', video.get('releaseDate'))) : ''}
                            {video.get('type') === 'MOVIE' && video.get('videoEpisodes')[0] && video.get('videoEpisodes')[0].downloadUrls[0].runtime/60 ? this.createEle('DURATION', parseInt(video.get('videoEpisodes')[0].downloadUrls[0].runtime/60) + Wording.MINUTES) : ''}
                            {video.get('alias') ? this.createEle('OTHER_NAMES', video.get('alias').join(', ')) : ''}
                        </div>
                        <StillsView video={this.props.video} shortFilms={this.state.shortFilms} />
                    </div>
                );
            }
        });

        return SeriesView;
    });
}(this));
