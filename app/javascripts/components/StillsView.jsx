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
                    disableNext : this.props.video.get('pictures').l.length ? false : true,
                    showLarge : false,
                    smallIndex : 0
                };
            },
            clickPrev : function () {
                var smallIndex = Math.max(this.state.smallIndex - 1, 0);
                this.setState({
                    smallIndex : smallIndex,
                    disablePrev : smallIndex === 0,
                    disableNext : smallIndex === this.props.video.get('pictures').l.length - 4
                });
            },
            clickNext : function () {
                var smallIndex = Math.min(this.state.smallIndex + 1, this.props.video.get('pictures').l.length - 4);
                this.setState({
                    smallIndex : smallIndex,
                    disablePrev : smallIndex === 0,
                    disableNext : smallIndex === this.props.video.get('pictures').l.length - 4
                });
            },
            render : function () {
                var video = this.props.video;
                return (
                    <div class="o-stills-ctn">
                        <div class="header-ctn w-hbox">
                            <div class="info">
                                <span class="w-text-secondary">{textEnums.PIC}</span>
                                <span class="count w-text-info">{FormatString(textEnums.TOTLE, [video.get('pictures').l.length])}</span>
                            </div>
                            <div class="navigator">
                                <div class={this.state.disablePrev ? 'prev disabled' : 'prev'} onClick={this.clickPrev} />
                                <div class={this.state.disableNext ? 'next disabled' : 'next'} onClick={this.clickNext} />
                            </div>
                        </div>
                        {this.renderSmallPicture()}
                    </div>
                );
            },
            renderSmallPicture : function () {
                var item = _.map(this.props.video.get('pictures').s, function (pic, index) {
                    var style = {
                        'background-image' : 'url(' + pic + ')'
                    };
                    return (
                        <li key={index}
                            style={style}
                            class="o-stills-smaill-item"
                            ref={"item" + index}
                            onClick={this.clickSmarllStills.bind(this, index)}>
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
            clickSmarllStills : function () {}
        });

        return StillsView;
    });
}(this));
