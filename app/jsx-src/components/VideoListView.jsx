/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        'Backbone',
        'utilities/Download',
        'utilities/FormatString',
        'utilities/FormatDate'
    ], function (
        React,
        _,
        Backbone,
        Download,
        FormatString,
        FormatDate
    ) {
        var queryAsync = function (data) {
            var deferred = $.Deferred();

            $.ajax({
                url : 'http://oscar.wandoujia.com/api/v1/search/',
                data : data || {},
                success : deferred.resolve,
                error : deferred.reject
            });

            return deferred.promise();
        };

        var textEnum = {
            LAST_EPISODE : '第{0}集',
            TOTLE_COMPLATE : '{0}集完',
            NO_RATING : '暂无评分',
            NO_DATA : '暂无数据'
        };

        var  ItemView = React.createClass({
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
                switch (type) {
                case "MOVIE":

                    if (rating && rating.length) {
                        rating = rating[0].rating;
                    } else {
                        rating = textEnum.NO_RATING;
                    }

                    ele = this.renderMovie(title, actors, rating);
                    break;
                case "TV":
                case "COMIC":

                    var episode;
                    if (data.latestEpisodeNum === data.totalEpisodesNum) {
                        episode = FormatString(textEnum.TOTLE_COMPLATE, [data.latestEpisodeNum]);
                    } else {
                        episode = FormatString(textEnum.LAST_EPISODE, [data.latestEpisodeNum]);
                    }

                    ele = this.renderTV(title, actors, episode);
                    break;
                case "VARIETY":

                    var presenters = data.presenters;
                    if (presenters.length) {
                        presenters = presenters.join(' / ');
                    } else {
                        presenters = textEnum.NO_DATA;
                    }

                    var episode;
                    if (data.latestEpisodeDate) {
                        episode = FormatDate('yyyy-MM-dd',data.latestEpisodeDate);
                    } else {
                        episode = textEnum.NO_DATA;
                    }

                    ele = this.renderVarirty(title, presenters, episode);
                    break;
                }

                return (
                    <li class="o-categories-item">
                        <div class="cover">
                            <img src={data.cover.l}/>
                        </div>
                        {ele}
                    </li>
                );
            },
            renderVarirty : function (title, presenters, episode) {
                return (
                    <div class="info">
                        <span class="title wc w-text-secondary" dangerouslySetInnerHTML={{ __html : title }}/>
                        <span class="presenters wc w-text-info">{presenters}</span>
                        <span class="episode w-text-info">{episode}</span><br/>
                        <button class="download w-btn w-btn-primary w-btn-mini" onClick={this.download}>下载</button>
                    </div>
                );
            },
            renderMovie : function (title, actors, rating) {
                return (
                    <div class="info">
                        <span class="title wc w-text-secondary" dangerouslySetInnerHTML={{ __html : title }}/>
                        <span class="actor wc w-text-info">{actors}</span>
                        <span class="rating w-text-info">{rating}</span><br/>
                        <button class="download w-btn w-btn-primary w-btn-mini" onClick={this.download}>下载</button>
                    </div>
                );
            },
            renderTV : function (title, actors, episode) {
                return (
                    <div class="info">
                        <span class="title wc w-text-secondary" dangerouslySetInnerHTML={{ __html : title }}/>
                        <span class="actor wc w-text-info">{actors}</span>
                        <span class="episode w-text-info">{episode}</span><br/>
                        <button class="download w-btn w-btn-primary w-btn-mini" onClick={this.download}>下载</button>
                    </div>
                );
            },
            download : function () {

                var videoEpisodes = this.props.data.videoEpisodes;
                var type = this.props.data.type;

                Download.downloadVideo(videoEpisodes, type);
            }
        });

        var VideoListView = React.createClass({
            checkArgs : function () {
                var data = this.props.data || {};

                return {
                    mixed : data.mixed === undefined ? true : data.mixed,
                    max : data.max || 4,
                    start : data.start === undefined ? 0 : data.start
                };
            },
            getInitialState : function () {

                var data = this.checkArgs();

                queryAsync(data).done(function (resp) {

                    this.videoList = resp.videoList;
                    this.setState({
                        'videoList' : resp.videoList
                    });

                }.bind(this));

                return {};
            },
            render : function () {

                return (
                    <div class="o-categories-diplay-container">
                        <ul class="o-categories-item-container">
                            {this.renderItem()}
                        </ul>
                    </div>
                );
            },
            renderItem : function () {
                var result = [];

                _.map(this.videoList, function (video) {
                    result.push(<ItemView data={video}/>);
                });

                return result;
            }
        });

        return VideoListView;
    });
}(this));