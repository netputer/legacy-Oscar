/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        'Backbone',
        'Wording',
        'GA',
        'utilities/FormatString',
        'mixins/ElementsGenerator'
    ], function (
        React,
        _,
        Backbone,
        Wording,
        GA,
        FormatString,
        ElementsGenerator
    ) {
        var InfoView = React.createClass({
            mixins : [ElementsGenerator],
            clickBtnDownload : function () {
                if (this.props.video.get('type') === 'MOVIE') {
                    ElementsGenerator.clickButtonDownload.call(this, this.props.source);
                } else {
                    this.props.onSelect();
                }
            },
            render : function () {
                var data = this.props.video.toJSON();

                return (
                    <div className="info-container">
                        <h4 className="title w-wc" dangerouslySetInnerHTML={{ __html : data.title }} onClick={this.props.onSelect}></h4>
                        {this.getActorsEle()}
                        {this.getCateEle()}
                        {this.getRatingEle()}
                        <div className="download-ctn w-hbox">
                            <button className="button-download w-btn w-btn-primary" onClick={this.clickBtnDownload}>{Wording.DOWNLOAD}</button>
                            {this.getProviderEle()}
                        </div>
                    </div>
                );
            }
        });

        var PictureView = React.createClass({
            render : function () {
                return (
                    <ul className="thumb-container w-hbox">
                    {this.renderItems()}
                    </ul>
                );
            },
            renderItems : function () {
                var pictures = this.props.data;
                var len = pictures.length > 4 ? 4 : pictures.length;
                var result = [];
                var i;

                for (i = 0; i < len; i++) {
                    result.push(
                        <li
                            className="thumb-item o-mask"
                            style={{ 'background-image' : 'url(' + pictures[i] + ')' }}
                            key={pictures[i]} />
                    );
                }

                return result;
            }
        });

        var VideoListItemView = React.createClass({
            clickItem : function () {
                this.props.onVideoSelect(this.props.video);
            },
            render : function () {
                var data = this.props.video.toJSON();
                return (
                    <li className="o-list-item w-hbox w-component-card">
                        <div className="o-mask item-cover"
                            style={{ 'background-image' : 'url(' + (data.cover.l || "") + ')' }}
                            onClick={this.clickItem} />
                        <InfoView video={this.props.video} onSelect={this.clickItem} />
                        <PictureView data={data.pictures.s} />
                    </li>
                );
            }
        });

        return VideoListItemView;
    });
}(this));
