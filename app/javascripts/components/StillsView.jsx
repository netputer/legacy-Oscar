/** @jsx React.DOM */
(function (window) {
    define([
        '$',
        'React',
        '_',
        'Backbone',
        'utilities/FormatString'
    ], function (
        $,
        React,
        _,
        Backbone,
        FormatString
    ) {

        var textEnums = {
            PIC : '剧照',
            TOTLE : '{0} 张',
            RETURN : '返回'
        };

        var StillsView = React.createClass({
            getInitialState : function () {
                return {
                    disablePrev : true,
                    disableNext : false,
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
                var smallIndex = Math.max(this.state.smallIndex - 1, 0);
                this.setState({
                    smallIndex : smallIndex,
                    disablePrev : smallIndex === 0,
                    disableNext : smallIndex === this.props.video.get('pictures').s.length - 4
                });
            },
            clickNext : function () {
                var smallIndex = Math.min(this.state.smallIndex + 1, this.props.video.get('pictures').l.length - 4);
                this.setState({
                    smallIndex : smallIndex,
                    disablePrev : smallIndex === 0,
                    disableNext : smallIndex === this.props.video.get('pictures').s.length - 4
                });
            },
            render : function () {
                var video = this.props.video;

                if (this.props.video.get('pictures').s.length > 0) {
                    return (
                        <div class="o-stills-ctn">
                            <div class="header-ctn w-hbox">
                                <div class="info">
                                    <h5 class="w-text-secondary">{textEnums.PIC}<span class="count w-text-info h6">{FormatString(textEnums.TOTLE, [video.get('pictures').s.length])}</span></h5>
                                </div>
                                <div class="navigator">
                                    <div class={this.state.disablePrev ? 'prev disabled' : 'prev'} onClick={this.clickPrev} />
                                    <div class={this.state.disableNext ? 'next disabled' : 'next'} onClick={this.clickNext} />
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
                            class="o-stills-small-item o-mask"
                            ref={"item" + index}
                            onClick={this.clickSmallStills.bind(this, index)}>
                        </li>
                    );
                }, this);

                var style = {
                    'margin-left' : -(this.state.smallIndex * 110)
                };

                return (
                    <ul class={this.state.showLarge ? 'o-stills-small-ctn w-cf hide' : 'o-stills-small-ctn w-cf'}
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
