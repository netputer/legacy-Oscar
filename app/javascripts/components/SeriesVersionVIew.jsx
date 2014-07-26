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
        'utilities/FormatString',
        'components/VideoListView'
    ], function (
        $,
        React,
        _,
        Backbone,
        Wording,
        VideoModel,
        FilterNullValues,
        FormatString,
        VideoListView
    ) {
        var SeriesVersionView = React.createClass({
            getInitialState : function () {
                return {
                    list : [],
                    smallIndex : 0,
                    disablePrev : true,
                    disableNext : true
                };
            },
            componentWillReceiveProps : function (newProps) {
                if (newProps.list.length) {
                    var list = _.uniq(newProps.list, function (item, key, id) {
                        if (item) {
                            return item.id;
                        }
                    });

                    this.setState({
                        list : list,
                        disablePrev : true,
                        disableNext : (newProps.list.length - 4 > 0) ? false : true
                    });
                }
            },
            clickPrev : function () {
                if (!this.state.disablePrev) {
                    var smallIndex = Math.max(this.state.smallIndex - 1, 0);
                    this.setState({
                        smallIndex : smallIndex,
                        disablePrev : smallIndex === 0,
                        disableNext : smallIndex === (this.state.list.length - 4)
                    });
                    this.refs['series'].getDOMNode().style.marginLeft = -125*nextState.smallIndex + 'px';
                }
            },
            clickNext : function () {
                if (!this.state.disableNext) {
                    var smallIndex = Math.min(this.state.smallIndex + 1, this.state.list.length - 4);
                    this.setState({
                        smallIndex : smallIndex,
                        disablePrev : smallIndex === 0,
                        disableNext : smallIndex === (this.state.list.length - 4)
                    });
                    this.refs['series'].getDOMNode().style.marginLeft = -125*nextState.smallIndex + 'px';
                }
            },
            onVideoSelect : function (id) {
                window.location.hash = 'detail/' + id;
            },
            render : function () {

                if (this.state.list.length) {
                    return (
                        <div className="o-stills-ctn w-wc">
                            <div className="header-ctn w-hbox">
                                <div className="info">
                                    <h5 className="w-text-secondary">{this.props.title}{Wording.RELATED_SERIES}</h5>
                                </div>
                                <div className="navigator">
                                    <div className={this.state.disablePrev ? 'prev disabled' : 'prev'} onClick={this.clickPrev} />
                                    <div className={this.state.disableNext ? 'next disabled' : 'next'} onClick={this.clickNext} />
                                </div>
                            </div>

                            <VideoListView title=""
                                list={this.state.list ? this.state.list : []}
                                onVideoSelect={this.onVideoSelect}
                                noBigItem={true}
                                ref="series" />
                        </div>
                    );
                } else {
                    return <div />;
                }
            }

        });

        return SeriesVersionView;
    });
}(this));
