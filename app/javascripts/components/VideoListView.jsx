/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        'Backbone',
        'Wording',
        'utilities/FormatString',
        'utilities/FormatDate',
        'components/WanxiaodouView'
    ], function (
        React,
        _,
        Backbone,
        Wording,
        FormatString,
        FormatDate,
        WanxiaodouView
    ) {

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
                    src = pictures.l !== undefined ? pictures.l[0] : pictures.s[0];
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
                    actors = Wording.NO_DATA;
                }

                var headInfo;
                var episode;

                switch (data.type) {
                case 'TV':
                case 'COMIC':
                    if (data.latestEpisodeNum === data.totalEpisodesNum && data.latestEpisodeNum) {
                        episode = FormatString(Wording.TOTLE_COMPLATE, [data.latestEpisodeNum]);
                    } else {
                        episode = data.latestEpisodeNum ? FormatString(Wording.LAST_EPISODE, [data.latestEpisodeNum]) : Wording.NO_DATA;
                    }

                    headInfo = actors;
                    break;
                case 'MOVIE':
                    var rating = data.marketRatings;
                    if (rating && rating.length) {
                        rating = rating[0].rating;
                    } else {
                        rating = Wording.NO_RATING;
                    }

                    var cates = data.categories;
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
                        presenters = Wording.NO_DATA;
                    }

                    if (data.latestEpisodeDate) {
                        episode = FormatDate('yyyy-MM-dd', data.latestEpisodeDate);
                    } else {
                        episode = Wording.NO_DATA;
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
                var data = this.props.data || {};
                var rating = data.marketRatings;
                var actors = data.actors || 0;
                var type = data.type;
                var title = data.title;

                if (actors.length) {
                    actors = actors.join(' / ');
                } else {
                    actors = Wording.NO_DATA;
                }

                var ele;
                var episode;

                switch (type) {
                case 'MOVIE':
                    if (rating && rating.length) {
                        rating = parseFloat(rating[0].rating).toFixed(1);
                    } else {
                        rating = Wording.NO_RATING;
                    }

                    episode = rating;
                    break;
                case 'TV':
                case 'COMIC':
                    if (data.latestEpisodeNum === data.totalEpisodesNum && data.latestEpisodeNum) {
                        episode = FormatString(Wording.TOTLE_COMPLATE, [data.latestEpisodeNum]);
                    } else {
                        episode = data.latestEpisodeNum ? FormatString(Wording.LAST_EPISODE, [data.latestEpisodeNum]) : Wording.NO_DATA;
                    }

                    break;
                case 'VARIETY':
                    var presenters = data.presenters || [];
                    if (presenters.length) {
                        presenters = presenters.join(' / ');
                    } else {
                        presenters = Wording.NO_DATA;
                    }

                    if (data.latestEpisodeDate) {
                        episode = FormatDate('yyyy-MM-dd',data.latestEpisodeDate);
                    } else {
                        episode = Wording.NO_DATA;
                    }

                    actors = presenters;
                    break;
                }

                var propTitle = data.title && data.title.length > 10 ? data.title : '';

                return (
                    <li className="o-categories-item w-component-card" title={propTitle} onClick={this.onClick}>
                        <div className="cover o-mask">
                            <img src={data.cover ? data.cover.l : ''}/>
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

                // Download.downloadVideo(videoEpisodes, type);
            }
        });

        var VideoListView = React.createClass({
            clickTitle : function () {
                if (this.props.cate !== 'VIDEO_WORKS') {
                    $('<a>').attr({
                        href : 'cate.html#' + this.props.cate.toLowerCase()
                    })[0].click();
                }
            },
            render : function () {
                if (!this.props.list || this.props.list.length === 0) {
                    if (this.props.loaded) {
                        return (<WanxiaodouView data-type="NO_VIDEO" />);
                    } else {
                        return <div className="o-categories-ctn"/>;
                    }
                } else if (this.props.noBigItem) {
                    return (
                        <div className="o-categories-ctn">
                            <h4 className="w-text-secondary title" onClick={this.clickTitle}>{Wording[this.props.cate]}</h4>
                            <ul className="o-categories-item-container w-cf">
                                {this.renderItem()}
                            </ul>
                        </div>
                    );
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
                if (this.props.list) {
                    var result = _.map(this.props.list.slice(this.props.noBigItem ? 0 : 1, this.props.list.length), function (video) {
                        if (video && video.id) {
                            return <ItemView data={video} key={video ? video.id : 0} onVideoSelect={this.props.onVideoSelect} />;
                        }
                    }, this);

                    return result;
                }
            }
        });

        return VideoListView;
    });
}(this));
