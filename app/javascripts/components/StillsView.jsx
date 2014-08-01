/** @jsx React.DOM */
(function (window) {
    define([
        '$',
        'React',
        '_',
        'Backbone',
        'Wording',
        'main/models/VideoModel',
        'mixins/FilterNullValues',
        'utilities/FormatString'
    ], function (
        $,
        React,
        _,
        Backbone,
        Wording,
        VideoModel,
        FilterNullValues,
        FormatString
    ) {
        var StillsView = React.createClass({
            getInitialState : function () {
                return {
                    disablePrev : true,
                    disableNext : (this.props.video.get('pictures').s.length - 5 > 0) ? false : true,
                    showLarge : false,
                    smallIndex : 0,
                    shortFilms : []
                };
            },
            componentWillReceiveProps : function (newProps) {
                this.setState({
                    disablePrev : true,
                    disableNext : (newProps.video.get('pictures').s.length + newProps.shortFilms.length - 5 > 0) ? false : true,
                    showLarge : false,
                    smallIndex : 0,
                    shortFilms : newProps.shortFilms
                });
            },
            clickPrev : function () {
                if (!this.state.disablePrev) {
                    var smallIndex = Math.max(this.state.smallIndex - 1, 0);
                    this.setState({
                        smallIndex : smallIndex,
                        disablePrev : smallIndex === 0,
                        disableNext : smallIndex === (this.props.video.get('pictures').s.length + this.state.shortFilms.length - 5)
                    });
                }
            },
            clickNext : function () {
                if (!this.state.disableNext) {
                    var smallIndex = Math.min(this.state.smallIndex + 1, this.props.video.get('pictures').s.length + this.state.shortFilms.length - 5);
                    this.setState({
                        smallIndex : smallIndex,
                        disablePrev : smallIndex === 0,
                        disableNext : smallIndex === (this.props.video.get('pictures').s.length + this.state.shortFilms.length - 5)
                    });
                }
            },
            renderItem : function () {

                var shortFilms = _.map(this.state.shortFilms, function (data, index) {
                    var videoModle = new VideoModel(FilterNullValues.filterNullValues.call(FilterNullValues, data));
                    var pic = videoModle.get('cover').l;
                    var style = {
                        'background-image' : 'url(' + (pic || '') + ')'
                    };
                    if (pic) {
                        return (
                            <li key={index}
                                style={style}
                                className="o-stills-small-item short-film"
                                ref={"item" + index}
                                onClick={this.clickShortFilm.bind(this, index)}>
                                <img src="../images/play-button.png" className="play-button" alt="{Wording.PLAYBUTTON_ALT}" />
                            </li>
                        );
                    }
                }, this);

                var pictures = _.map(this.props.video.get('pictures').s, function (pic, index) {
                    var style = {
                        'background-image' : 'url(' + pic + ')'
                    };
                    return (
                        <li key={index}
                            style={style}
                            className="o-stills-small-item o-mask"
                            ref={"item" + index}
                            onClick={this.clickSmallStills.bind(this, index)}>
                        </li>
                    );
                }, this);

                var shortLength = this.state.shortFilms ? this.state.shortFilms.length : 0;

                var style = {
                    'margin-left' : this.state.smallIndex < shortLength ? -(this.state.smallIndex * 125) : -(shortLength * 125 + (this.state.smallIndex-shortLength) * 125)
                };

                return (
                    <ul className={this.state.showLarge ? 'o-stills-small-ctn w-cf hide' : 'o-stills-small-ctn w-cf'}
                        ref="o-stills-small-ctn"
                        style={style}>
                        {shortFilms}
                        {pictures}
                    </ul>
                );
            },
            clickShortFilm : function (index) {
                var url = this.state.shortFilms[index].videoEpisodes[0].playInfo[0].url;
                var $a = $('<a>').attr({
                    href : url,
                    target : '_default'
                })[0].click();
            },
            clickSmallStills : function (index) {
            },
            getNavigator : function () {
                if (this.props.video.get('pictures').s.length > 5 || this.props.video.get('pictures').s.length + this.state.shortFilms.length > 4) {
                    return (
                        <div className="navigator">
                            <div className={this.state.disablePrev ? 'prev disabled' : 'prev'} onClick={this.clickPrev} />
                            <div className={this.state.disableNext ? 'next disabled' : 'next'} onClick={this.clickNext} />
                        </div>

                    );
                }
            },
            render : function () {
                var video = this.props.video;
                if (video.get('pictures').s.length > 0 || this.props.shortFilms.length > 0) {
                    return (
                        <div className="o-stills-ctn">
                            <div className="header-ctn">
                                <div className="info">
                                    <h5 className="w-text-secondary">{this.state.shortFilms.length ? Wording.TRAILOR + ' · ' : ''} {Wording.STILLS}</h5>
                                </div>
                                {this.getNavigator()}
                            </div>
                            {this.renderItem()}
                        </div>
                    );
                } else {
                    return <div />;
                }
            }
        });

        return StillsView;
    });
}(this));
