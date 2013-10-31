/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        'Wording',
        'utilities/FormatString',
        'mixins/ElementsGenerator'
    ], function (
        React,
        Wording,
        FormatString,
        ElementsGenerator
    ) {

        var SeriesHeaderView = React.createClass({
            mixins : [ElementsGenerator],
            render : function () {
                var data = this.props.video.toJSON();

                var stillsBgStyle = {
                    'background-image' : 'url(' + data.cover.s + ')'
                };

                return (
                    <div className="o-series-panel-header w-hbox">
                        <div className="stills o-mask" style={stillsBgStyle}></div>
                        <div className="info-ctn w-vbox">
                            <h4>{data.title}</h4>
                            <div className="info w-vbox">
                                {this.getActorsEle()}
                                {this.getCateEle()}
                                {this.getRatingEle()}
                                <div className="download-info">
                                    {this.getDownloadBtn('download_all')}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
        });

        return SeriesHeaderView;
    });
}(this));
