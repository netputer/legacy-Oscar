/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        'Backbone',
        'utilities/FormatString',
        'mixins/ElementsGenerator'
    ], function (
        React,
        _,
        Backbone,
        FormatString,
        ElementsGenerator
    ) {

        var textEnum = {
            LAST_EPISODE : '第{0}集',
            TOTLE_COMPLATE : '{0}集完',
            NO_RATING : '暂无评分',
            NO_DATA : '暂无数据',
            ACTORS : '主演：{0}',
            RATING : '评分：<span class="rating">{0}</span>',
            DOWNLOAD_ALL : '下载全部',
            DOWNLOAD : '下载',
            PROVIDER : '来源：{0}',
            PRESENTER : '主持人：{0}'
        };

        var InfoView = React.createClass({
            mixins : [ElementsGenerator],
            render : function () {
                var data = this.props.video.toJSON();

                return (
                    <div class="info-container">
                        <h4 class="title w-wc" dangerouslySetInnerHTML={{ __html : data.title }} onClick={this.props.onSelect}></h4>
                        {this.getActorsEle()}
                        {this.getCateEle()}
                        {this.getRatingEle()}
                        <div class="download-ctn w-hbox">
                            {this.getDownloadBtn()}
                            <span class="provider w-wc w-text-info">{FormatString(textEnum.PROVIDER, [data.providerNames])}</span>
                        </div>
                    </div>
                );
            }
        });

        var PictureView = React.createClass({
            render : function () {
                return (
                    <ul class="thumb-container w-hbox">
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
                            class="thumb-item o-mask"
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
                    <li class="o-list-item w-hbox w-component-card">
                        <div class="o-mask item-cover"
                            style={{ 'background-image' : 'url(' + data.cover.l + ')' }}
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
