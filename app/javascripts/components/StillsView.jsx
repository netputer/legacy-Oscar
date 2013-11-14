/** @jsx React.DOM */
(function (window) {
    define([
        '$',
        'React',
        '_',
        'Backbone',
        'Wording',
        'utilities/FormatString'
    ], function (
        $,
        React,
        _,
        Backbone,
        Wording,
        FormatString
    ) {
        var StillsView = React.createClass({
            getInitialState : function () {
                return {
                    disablePrev : true,
                    disableNext : (this.props.video.get('pictures').s.length - 4 > 0) ? false : true,
                    showLarge : false,
                    smallIndex : 0
                };
            },
            componentWillReceiveProps : function (newProps) {
                this.setState({
                    disablePrev : true,
                    disableNext : (newProps.video.get('pictures').s.length - 4 > 0) ? false : true,
                    showLarge : false,
                    smallIndex : 0
                });
            },
            clickPrev : function () {
                if (!this.state.disablePrev) {
                    var smallIndex = Math.max(this.state.smallIndex - 1, 0);
                    this.setState({
                        smallIndex : smallIndex,
                        disablePrev : smallIndex === 0,
                        disableNext : smallIndex === (this.props.video.get('pictures').s.length - 4)
                    });
                }
            },
            clickNext : function () {
                if (!this.state.disableNext) {
                    var smallIndex = Math.min(this.state.smallIndex + 1, this.props.video.get('pictures').l.length - 4);
                    this.setState({
                        smallIndex : smallIndex,
                        disablePrev : smallIndex === 0,
                        disableNext : smallIndex === (this.props.video.get('pictures').s.length - 4)
                    });
                }
            },
            render : function () {
                var video = this.props.video;

                if (this.props.video.get('pictures').s.length > 0) {
                    return (
                        <div className="o-stills-ctn">
                            <div className="header-ctn w-hbox">
                                <div className="info">
                                    <h5 className="w-text-secondary">{Wording.STILLS}<span className="count w-text-info h6">{FormatString(Wording.STILLS_COUNT, video.get('pictures').s.length)}</span></h5>
                                </div>
                                <div className="navigator">
                                    <div className={this.state.disablePrev ? 'prev disabled' : 'prev'} onClick={this.clickPrev} />
                                    <div className={this.state.disableNext ? 'next disabled' : 'next'} onClick={this.clickNext} />
                                </div>
                            </div>
                            {this.renderSmallPicture()}
                        </div>
                    );
                } else {
                    return <div />;
                }
            },
            renderSmallPicture : function () {
                var item = _.map(this.props.video.get('pictures').s, function (pic, index) {
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

                var style = {
                    'margin-left' : -(this.state.smallIndex * 110)
                };

                return (
                    <ul className={this.state.showLarge ? 'o-stills-small-ctn w-cf hide' : 'o-stills-small-ctn w-cf'}
                        ref="o-stills-small-ctn"
                        style={style}>
                        {item}
                    </ul>
                );
            },
            clickSmallStills : function (index) {
                console.log(this.props.video.get('pictures').l[index]);
            }
        });

        return StillsView;
    });
}(this));
