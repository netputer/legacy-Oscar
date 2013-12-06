/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        'IO',
        'Actions',
        'Wording',
        'GA',
        'mixins/FilterNullValues',
        'components/searchbox/SearchBoxView',
        'components/BannerView',
        'components/VideoListView',
        'components/FilterSectionView',
        'components/FooterView'
    ], function (
        React,
        IO,
        Actions,
        Wording,
        GA,
        FilterNullValues,
        SearchBoxView,
        BannerView,
        VideoListView,
        FilterSectionView,
        FooterView
    ) {

        var queryAsync = function (type) {
            var deferred = $.Deferred();

            IO.requestAsync({
                url : Actions.actions.SEARCH,
                data : {
                    content_type : type,
                    max : 10,
                    rank_type : 'hot',
                    pos : 'w/indexpage',
                    opt_fields : [
                        'title',
                        'type',
                        'id',
                        'actors',
                        'pictures.l',
                        'cover.l',
                        'latestEpisodeNum',
                        'latestEpisodeDate',
                        'totalEpisodesNum',
                        'marketRatings.rating',
                        'categories',
                        'presenters'
                    ].join(',')
                },
                timeout : 1000 * 20,
                success : deferred.resolve,
                error : deferred.reject
            });

            return deferred.promise();
        };

        var IndexPage = React.createClass({
            getInitialState : function () {
                return {
                    listTv : [],
                    listMovie : [],
                    listComic : [],
                    listVariety : []
                };
            },
            componentWillMount : function () {
                var start = performance.timing.navigationStart;

                $.when(queryAsync('tv').done(function (resp) {
                    this.setState({
                        listTv : resp.videoList
                    });

                    GA.log({
                        'event' : 'video.performance',
                        'page' : 'index',
                        'metric' : 'tti',
                        'time' : new Date().getTime() - start
                    });
                }.bind(this)), queryAsync('movie').done(function (resp) {
                    this.setState({
                        listMovie : resp.videoList
                    });
                }.bind(this)), queryAsync('comic').done(function (resp) {
                    this.setState({
                        listComic : resp.videoList
                    });
                }.bind(this)), queryAsync('variety').done(function (resp) {
                    this.setState({
                        listVariety : resp.videoList
                    });
                }.bind(this))).always(function () {
                    GA.log({
                        'event' : 'video.performance',
                        'page' : 'index',
                        'metric' : 'loaded',
                        'time' : new Date().getTime() - start
                    });
                });
            },
            onSearchAction : function (query) {
                if (query.length) {
                    $('<a>').attr({
                        href : 'search.html#q/' + query
                    })[0].click();
                }
            },
            onVideoSelect : function (id) {
                window.location.hash = '#detail/' + id;
            },
            clickBanner : function (cate, query) {
                $('<a>').attr({
                    href : 'cate.html?' + query + '#' + cate
                })[0].click();
            },
            render : function () {
                return (
                    <div className="o-ctn">
                        <SearchBoxView
                            className="o-search-box-ctn"
                            onAction={this.onSearchAction}
                            source="homepage" />
                         <BannerView
                            source="index" />
                        <VideoListView cate="TV" list={this.state.listTv} onVideoSelect={this.onVideoSelect} />
                        <div>
                            <div className="o-category-banner w-component-card banner1" onClick={this.clickBanner.bind(this, 'tv', 'areas=美国')}></div>
                            <div className="o-category-banner w-component-card banner2" onClick={this.clickBanner.bind(this, 'tv', 'categories=言情')}></div>
                            <FilterSectionView title={Wording.REGION} type="tv" filter="areas" />
                        </div>
                        <VideoListView cate="MOVIE" list={this.state.listMovie} onVideoSelect={this.onVideoSelect} />
                        <div>
                            <div className="o-category-banner w-component-card banner3" onClick={this.clickBanner.bind(this, 'movie', 'categories=动作')}></div>
                            <div className="o-category-banner w-component-card banner4" onClick={this.clickBanner.bind(this, 'movie', 'categories=偶像')}></div>
                            <FilterSectionView title={Wording.MOVIE} type="movie" filter="categories" />
                        </div>
                        <VideoListView cate="COMIC" list={this.state.listComic} onVideoSelect={this.onVideoSelect} />
                        <div>
                            <div className="o-category-banner w-component-card banner5" onClick={this.clickBanner.bind(this, 'comic', 'categories=神魔')}></div>
                            <div className="o-category-banner w-component-card banner6" onClick={this.clickBanner.bind(this, 'comic', 'categories=loli')}></div>
                            <FilterSectionView title={Wording.COMIC} type="comic" filter="categories" />
                        </div>
                        <VideoListView cate="VARIETY" list={this.state.listVariety} onVideoSelect={this.onVideoSelect} />
                        <div>
                            <div className="o-category-banner w-component-card banner7" onClick={this.clickBanner.bind(this, 'variety', 'categories=访谈')}></div>
                            <div className="o-category-banner w-component-card banner8" onClick={this.clickBanner.bind(this, 'variety', 'categories=选秀')}></div>
                            <FilterSectionView title={Wording.VARIETY} type="variety" filter="categories" />
                        </div>
                        <FooterView />
                    </div>
                );
            }
        });

        return IndexPage;
    });
}(this));
