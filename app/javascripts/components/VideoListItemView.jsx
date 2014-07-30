/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        'Backbone',
        'Wording',
        'GA',
        'utilities/QueryHelper',
        'utilities/FormatString',
        'components/LoadingView',
        'main/models/VideoModel',
        'mixins/Performance',
        'mixins/FilterNullValues',
        'mixins/ElementsGenerator'
    ], function (
        React,
        _,
        Backbone,
        Wording,
        GA,
        QueryHelper,
        FormatString,
        LoadingView,
        VideoModel,
        Performance,
        FilterNullValues,
        ElementsGenerator
    ) {
        var InfoView = React.createClass({
            mixins : [ElementsGenerator],
            getInitialState : function () {
                return {
                    loadingEpisodes : false
                }
            },
            clickBtnDownload : function () {
                if (this.props.video.get('type') === 'MOVIE') {
                    this.setState({
                        loadingEpisodes : true
                    });
                    QueryHelper.queryEpisodesAsync(this.props.video.id).done(function (resp) {
                        this.props.setEpisodes(resp).done(function (resp) {
                            ElementsGenerator.clickButtonDownload.call(this, this.props.source);

                            this.setState({
                                loadingEpisodes : false
                            });
                        }.bind(this));
                    }.bind(this));
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
                            <LoadingView show={this.state.loadingEpisodes} />
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
            mixins : [Performance],
            getInitialState : function () {
                return {
                    video: new VideoModel(FilterNullValues.filterNullValues.call(FilterNullValues, this.props.origin))
                };
            },
            onVideoSelect : function (id) {
                this.setTimeStamp(new Date().getTime(), id);
                window.location.hash = '#detail/' + id;
            },
            setEpisodes : function (resp) {
                var deferred = $.Deferred();

                var video = this.props.origin;

                video.videoEpisodes = resp.videoEpisodes;

                this.setState({
                    video : new VideoModel(FilterNullValues.filterNullValues.call(FilterNullValues, video))
                })

                deferred.resolve(this.props.video);

                return deferred.promise();
            },
            render : function () {
                var data = this.props.video.toJSON();
                return (
                    <li className="o-list-item w-hbox w-component-card">
                        <div className="o-mask item-cover"
                            style={{ 'background-image' : 'url(' + (data.cover.l || "") + ')' }}
                            onClick={this.clickItem} />
                        <InfoView video={this.state.video} setEpisodes={this.setEpisodes} onSelect={this.onVideoSelect.bind(this, data.id)} />
                        <PictureView data={data.pictures.s} />
                    </li>
                );
            }
        });

        return VideoListItemView;
    });
}(this));
