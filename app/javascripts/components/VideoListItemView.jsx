/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        'Backbone',
        'utilities/FormatString'
    ], function (
        React,
        _,
        Backbone,
        FormatString
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
            getDownloadEle : function (data) {
                switch (data.type) {
                case 'MOVIE':
                case 'TV':
                case 'VARIETY':
                    return <button class="download w-btn w-btn-primary" onClick={this.download}>{textEnum.DOWNLOAD}</button>;
                    break;
                case 'COMIC':
                    return <button class="download w-btn w-btn-primary" onClick={this.download}>{textEnum.DOWNLOAD_ALL}</button>;
                    break;
                }
            },
            getPresenters : function (data) {
                var result = '';
                if (data.type === 'VARIETY') {
                    result = FormatString(textEnum.PRESENTER, [data.presenters])
                } else {
                    result = FormatString(textEnum.ACTORS, [data.actors]);
                }

                return result;
            },
            render : function () {
                var data = this.props.data;
                var rating = data.rating;
                var title = data.title;
                var region = data.region || '';
                var categories = data.categories;
                var providerNames = data.providerNames;
                var year = data.year;

                return (
                    <div class="info-container">
                        <h3 class="title w-wc" dangerouslySetInnerHTML={{ __html : title }}></h3>
                        <div class="actors w-text-info w-wc">{this.getPresenters(data)}</div>
                        <div class="categories w-text-info w-wc">{categories + (region && ' / ' + region) + (year && ' / ' + year + '年')}</div>
                        <div class="w-text-info w-wc" dangerouslySetInnerHTML={{ __html : FormatString(textEnum.RATING, [rating]) }}></div>
                        <div class="download-ctn w-hbox">
                            {this.getDownloadEle(data)}
                            <span class="provider w-wc">{FormatString(textEnum.PROVIDER, [providerNames])}</span>
                        </div>
                    </div>
                );
            },
            download: function () {

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
                            class="thumb-item"
                            style={{ 'background-image' : 'url(' + pictures[i] + ')' }}
                            key={pictures[i]} />
                    );
                }

                return result;
            }
        });

        var VideoListItemView = React.createClass({
            render : function () {
                var data = this.props['data-model'].toJSON();
                return (
                    <li class="o-list-item w-hbox">
                        <div class="item-cover" style={{ 'background-image' : 'url(' + data.cover.l + ')' }} />
                        <InfoView data={data} />
                        <PictureView data={data.pictures.s} />
                    </li>
                );
            }
        });

        return VideoListItemView;
    });
}(this));
