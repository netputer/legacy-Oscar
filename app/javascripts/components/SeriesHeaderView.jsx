/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        'Wording',
        'utilities/FormatString',
        'main/ElementsGenerator'
    ], function (
        React,
        Wording,
        FormatString,
        ElementsGenerator
    ) {
        console.log();

        var SeriesHeaderView = React.createClass({
            mixins : [ElementsGenerator],
            render : function () {
                var data = this.props.video.toJSON();

                var stillsBgStyle = {
                    'background-image' : 'url(' + data.cover.s + ')'
                };

                return (
                    <div class="o-series-panel-header w-hbox">
                        <div class="stills" style={stillsBgStyle}></div>
                        <div class="info-ctn w-vbox">
                            <h4>{data.title}</h4>
                            <div class="info w-vbox">
                                <div class="w-text-info w-wc">{Wording.ACTORS_LABEL + data.actors}</div>
                                <div class="w-text-info w-wc">{data.categories} / {FormatString(Wording.YEAR, data.year)}</div>
                                <div class="w-text-info w-wc">{Wording.RATING_LABEL}<span class="h4">{data.rating}</span></div>
                                <div class="download-info">
                                    {this.getDownloadBtn()}
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
