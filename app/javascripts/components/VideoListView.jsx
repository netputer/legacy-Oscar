/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        'Backbone',
        'Wording',
        'utilities/Download',
        'utilities/FormatString',
        'utilities/FormatDate',
        'components/WanxiaodouView'
    ], function (
        React,
        _,
        Backbone,
        Wording,
        Download,
        FormatString,
        FormatDate,
        WanxiaodouView
    ) {

        var textEnum = {
            LAST_EPISODE : '第 {0} 集',
            TOTLE_COMPLATE : '{0} 集完',
            NO_RATING : '暂无评分',
            NO_DATA : '暂无数据'
        };

        var DownloadHandler = {
            onClick : function () {
                this.props.onVideoSelect(this.props.data.id);
            }
        };

        var BigItemView = React.createClass({
            mixins : [DownloadHandler],
            render : function () {
                var data = this.props.data;
                var pictures = data.pictures;
                var src = '';

                if (pictures) {
                    src = pictures.l[0];
                } else if (data.cover.l){
                    src = data.cover.l;
                }

                var style = {
                    'background-image' : 'url(' + src + ')'
                };

                return (
                    <li className="o-categories-item-big w-component-card o-mask"
                        key={data.title}
                        style={style}
                        onClick={this.onClick} >
                        <div className="info-ctn w-vbox">
                            <h3 className="title">{this.props.data.title}</h3>
                            {this.renderInfo()}
                            <button className="w-btn w-btn-primary">离线缓存</button>
                        </div>
                    </li>
                );
            },
            renderInfo : function () {
                var data = this.props.data;
                var info;
                var actors;

                if (data.actors.length) {
                    actors = data.actors.join(' / ');
                } else {
                    actors = textEnum.NO_DATA;
                }

                var headInfo;
                var episode;

                switch (data.type) {
                case 'TV':
                case 'COMIC':
                    if (data.latestEpisodeNum === data.totalEpisodesNum) {
                        episode = FormatString(textEnum.TOTLE_COMPLATE, [data.latestEpisodeNum]);
                    } else {
                        episode = FormatString(textEnum.LAST_EPISODE, [data.latestEpisodeNum]);
                    }

                    headInfo = actors;
                    break;
                case 'MOVIE':
                    var rating = data.marketRatings;
                    if (rating && rating.length) {
                        rating = rating[0].rating;
                    } else {
                        rating = textEnum.NO_RATING;
                    }

                    var cates = data.categories;
                    console.log(cates)
                    if (cates && cates.length > 0) {
                        var tmp = [];
                        _.map(cates, function (cate) {
                            tmp.push(_.pick(cate, 'name')['name']);
                        });
                        cates = tmp.join(' / ');
                    }

                    headInfo = cates;
                    episode = rating;
                    break;
                case 'VARIETY':
                    var presenters = data.presenters;
                    if (presenters.length) {
                        presenters = presenters.join(' / ');
                    } else {
                        presenters = textEnum.NO_DATA;
                    }

                    if (data.latestEpisodeDate) {
                        episode = FormatDate('yyyy-MM-dd', data.latestEpisodeDate);
                    } else {
                        episode = textEnum.NO_DATA;
                    }

                    headInfo = presenters;
                    break;
                }

                info = [
                    <span key="actors" className="actors w-wc">{headInfo}</span>,
                    <span key="episode" className="episode">{episode}</span>
                ];

                return <p className="info-text">{info}</p>
            }
        });

        var ItemView = React.createClass({
            mixins : [DownloadHandler],
            render : function () {
                var data = this.props.data;
                var rating = data.marketRatings;
                var actors = data.actors;
                var type = data.type;
                var title = data.title;

                if (actors.length) {
                    actors = actors.join(' / ');
                } else {
                    actors = textEnum.NO_DATA;
                }

                var ele;
                var episode;

                switch (type) {
                case 'MOVIE':
                    if (rating && rating.length) {
                        rating = rating[0].rating;
                    } else {
                        rating = textEnum.NO_RATING;
                    }

                    episode = rating;
                    break;
                case 'TV':
                case 'COMIC':
                    if (data.latestEpisodeNum === data.totalEpisodesNum) {
                        episode = FormatString(textEnum.TOTLE_COMPLATE, [data.latestEpisodeNum]);
                    } else {
                        episode = FormatString(textEnum.LAST_EPISODE, [data.latestEpisodeNum]);
                    }

                    break;
                case 'VARIETY':
                    var presenters = data.presenters;
                    if (presenters.length) {
                        presenters = presenters.join(' / ');
                    } else {
                        presenters = textEnum.NO_DATA;
                    }

                    if (data.latestEpisodeDate) {
                        episode = FormatDate('yyyy-MM-dd',data.latestEpisodeDate);
                    } else {
                        episode = textEnum.NO_DATA;
                    }

                    actors = presenters;
                    break;
                }

                var propTitle = data.title.length > 10 ? data.title : '';

                return (
                    <li className="o-categories-item w-component-card" title={propTitle} onClick={this.onClick}>
                        <div className="cover o-mask">
                            <img src={data.cover.l}/>
                        </div>
                        <div className="info">
                            <span className="title w-wc w-text-secondary">{title}</span>
                            <span className="actors w-wc w-text-info">{actors}</span>
                            <span className="episode w-wc w-text-info">{episode}</span>
                            <button className="download w-btn w-btn-primary w-btn-mini" onClick={this.download}>离线缓存</button>
                        </div>
                    </li>
                );
            },
            download : function () {
                var videoEpisodes = this.props.data.videoEpisodes;
                var type = this.props.data.type;

                Download.downloadVideo(videoEpisodes, type);
            }
        });

        var VideoListView = React.createClass({
            clickTitle : function () {
                $('<a>').attr({
                    href : 'cate.html#' + this.props.cate.toLowerCase()
                })[0].click();
            },
            render : function () {
                if (!this.props.list || this.props.list.length === 0) {
                    if (this.props.loaded) {
                        return (<WanxiaodouView data-type="NO_VIDEO" />);
                    } else {
                        return <div className="o-categories-ctn"/>;
                    }
                } else {
                    return (
                        <div className="o-categories-ctn">
                            <h4 className="w-text-secondary title" onClick={this.clickTitle}>{Wording[this.props.cate]}</h4>
                            <ul className="o-categories-item-container w-cf">
                                <BigItemView data={this.props.list[0]} onVideoSelect={this.props.onVideoSelect} />
                                {this.renderItem()}
                            </ul>
                        </div>
                    );
                }
            },
            renderItem : function () {
                var result = _.map(this.props.list.slice(1, this.props.list.length), function (video) {
                    return <ItemView data={video} key={video.id} onVideoSelect={this.props.onVideoSelect} />;
                }, this);

                return result;
            }
        });

        return VideoListView;
    });
}(this));
