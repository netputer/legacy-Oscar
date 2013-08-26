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
            render : function () {

                var data = this.props.data;
                var rating = data.marketRatings;
                var actors = data.actors;
                var type = data.type;
                var title = data.title;
                var region = data.region || '';
                var categories = data.categories;
                var providerNames = data.providerNames;
                var year = data.year;

                if (actors.length) {
                    actors = actors.join(' / ');
                } else {
                    actors = textEnum.NO_DATA;
                }

                if (rating && rating.length) {
                    rating = rating[0].rating;
                } else {
                    rating = textEnum.NO_RATING;
                }

                if (categories && categories.length) {
                    categories = _.pluck(categories, 'name').join(' / ');
                } else {
                    categories = textEnum.NO_DATA;
                }

                if (providerNames && providerNames.length) {
                    providerNames = providerNames.join(' / ');
                } else {
                    providerNames = '';
                }

                switch (data.type) {
                case "MOVIE":

                    return (
                        <div class="o-info-container">
                            <h3 class="title">{title}</h3>
                            <span class="actors w-text-info wc">{FormatString(textEnum.ACTORS, [actors])}</span>
                            <span class="categories w-text-info">{categories + (region && ' / ' + region) + (year && ' / ' + year + '年')}</span><br/>
                            <span class="w-text-info" dangerouslySetInnerHTML={{ __html : FormatString(textEnum.RATING, [rating]) }}></span><br/>
                            <button class="download w-btn w-btn-primary" onClick={this.download}>{textEnum.DOWNLOAD}</button>
                            <span class="provider">{FormatString(textEnum.PROVIDER, [providerNames])}</span>
                        </div>
                    );
                case "TV":
                case "COMIC":

                    return (
                        <div class="o-info-container">
                            <h3 class="title">{title}</h3>
                            <span class="actors w-text-info wc">{FormatString(textEnum.ACTORS, [actors])}</span>
                            <span class="categories w-text-info">{categories + (region && ' / ' + region) + (year && ' / ' + year + '年')}</span><br/>
                            <span class="w-text-info" dangerouslySetInnerHTML={{ __html : FormatString(textEnum.RATING, [rating]) }}></span><br/>
                            <button class="download w-btn w-btn-primary" onClick={this.download}>{textEnum.DOWNLOAD_ALL}</button>
                            <span class="provider">{FormatString(textEnum.PROVIDER, [providerNames])}</span>
                        </div>
                    );
                    break;
                case "VARIETY":

                    var presenters = data.presenters;
                    if (presenters.length) {
                        presenters = presenters.join(' / ');
                    } else {
                        presenters = textEnum.NO_DATA;
                    }

                    return (
                        <div class="o-info-container">
                            <h3 class="title">{title}</h3>
                            <span class="presenters w-text-info wc">{FormatString(textEnum.PRESENTER, [presenters])}</span>
                            <span class="categories w-text-info">{categories + (region && ' / ' + region) + (year && ' / ' + year + '年')}</span><br/>
                            <span class="w-text-info" dangerouslySetInnerHTML={{ __html : FormatString(textEnum.RATING, [rating]) }}></span><br/>
                            <button class="download w-btn w-btn-primary" onClick={this.download}>{textEnum.DOWNLOAD}</button>
                            <span class="provider">{FormatString(textEnum.PROVIDER, [providerNames])}</span>
                        </div>
                    );
                    break;
                }
            },
            download: function () {

            }
        });

        var PictureView = React.createClass({
            getInitialState : function () {
                return {
                    className : ''
                };
            },
            render : function () {
                return (
                    <div class="o-picture-container">
                        <ul class="o-picture-item-container">
                        {this.renderItems()}
                        </ul>
                    </div>
                );
            },
            renderItems : function () {
                var pictures = this.props.data;
                var len = pictures.length > 4 ? 4 : pictures.length;
                var result = [];

                for (var i = 0; i < len; i++) {
                    result.push(
                        <li class="o-picture-item">
                            <img ref={'item' + i} src={pictures[i]} class={this.state.className}/>
                        </li>
                    );
                }

                return result;
            },
            componentDidMount : function () {
                _.map(this.refs, function (item) {
                    var node = item.getDOMNode();
                    node.onload = function () {
                        var width = this.width;
                        var height = this.height;

                        if (width >= height) {
                            this.className = 'horizontal';
                        } else {
                            this.className = 'vertical';
                        }
                    }
                });
            }
        });

        var BannerView = React.createClass({
            render : function () {

                var data = this.props.data;

                return (
                    <div class="o-banner-container">
                        <div class="o-cover">
                            <img src={data.cover.l}/>
                        </div>
                        <InfoView data={data}/>
                        <PictureView data={data.pictures.s}/>
                    </div>
                );
            }
        });

        return BannerView;
    });
}(this));
