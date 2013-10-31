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
                    'background-image' : 'url(' + (data.cover.s || "") + ')'
                };

                return (
                    <div class="o-series-panel-header w-hbox">
                        <div class="stills o-mask" style={stillsBgStyle}></div>
                        <div class="info-ctn w-vbox">
                            <h4>{data.title}</h4>
                            <div class="info w-vbox">
                                {this.getActorsEle()}
                                {this.getCateEle()}
                                {this.getRatingEle()}
                                <div class="download-info">
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
