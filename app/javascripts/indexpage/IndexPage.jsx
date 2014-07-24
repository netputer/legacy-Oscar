/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        'IO',
        'Actions',
        'Wording',
        'GA',
        'mixins/Performance',
        'mixins/FilterNullValues',
        'components/searchbox/SearchBoxView',
        'components/VideoListView',
        'components/FilterSectionView',
        'components/FooterView'
    ], function (
        React,
        IO,
        Actions,
        Wording,
        GA,
        Performance,
        FilterNullValues,
        SearchBoxView,
        VideoListView,
        FilterSectionView,
        FooterView
    ) {

        var flag = 1;

        var queryAsync = function (type) {
            var deferred = $.Deferred();

            IO.requestAsync({
                url : Actions.actions.SEARCH,
                data : {
                    content_type : type,
                    max : 10,
                    rank_type : 'update',
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
                        'categories.*',
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
            mixins : [Performance],
            getInitialState : function () {
                return {
                    listTv : [],
                    listMovie : [],
                    listComic : [],
                    listVariety : [],
                    shouldLoad : {
                        tv : true,
                        movie : true,
                        comic : false,
                        variety : false
                    }
                };
            },
            componentWillMount : function () {
                this.initPerformance('index', 5);

                $.when(queryAsync('tv').done(function (resp) {
                    this.setState({
                        listTv : resp.videoList
                    });
                    this.loaded();
                }.bind(this)), queryAsync('movie').done(function (resp) {
                    this.setState({
                        listMovie : resp.videoList
                    });
                    this.loaded();
                }.bind(this))).then(function(){}, this.abortTracking.bind(this, 'loadComplete'));
            },
            componentDidMount : function () {
                window.addEventListener('scroll', this.lazyLoad, false);
            },
            lazyLoad : function (evt) {
                if ($(document).scrollTop() > 85 && flag) {
                    flag = !flag;
                    $.when(queryAsync('comic').done(function (resp) {
                        this.setState({
                            listComic : resp.videoList
                        });
                    }.bind(this)), queryAsync('variety').done(function (resp) {
                        this.setState({
                            listVariety : resp.videoList
                        });
                    }.bind(this)));

                    this.setState({
                        shouldLoad : {
                            tv : true,
                            movie : true,
                            comic : true,
                            variety : true
                        }
                    })
                }

            },
            onSearchAction : function (query) {
                if (query.length) {
                    $('<a>').attr({
                        href : 'search.html?q=' + query
                    })[0].click();
                }
            },
            onVideoSelect : function (id) {
                this.setTimeStamp(new Date().getTime(), id);
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
                        <VideoListView cate="TV" list={this.state.listTv} onVideoSelect={this.onVideoSelect} />
                        <div>
                            <div className="o-category-banner w-component-card banner1" onClick={this.clickBanner.bind(this, 'tv', 'areas=美国')}></div>
                            <div className="o-category-banner w-component-card banner2" onClick={this.clickBanner.bind(this, 'tv', 'categories=言情')}></div>
                            <FilterSectionView load={this.loaded} abortTracking={this.abortTracking} title={Wording.REGION} shouldLoad={this.state.shouldLoad} type="tv" filter="areas" />
                        </div>
                        <VideoListView cate="MOVIE" list={this.state.listMovie} onVideoSelect={this.onVideoSelect} />
                        <div>
                            <div className="o-category-banner w-component-card banner3" onClick={this.clickBanner.bind(this, 'movie', 'categories=动作')}></div>
                            <div className="o-category-banner w-component-card banner4" onClick={this.clickBanner.bind(this, 'movie', 'categories=偶像')}></div>
                            <FilterSectionView load={this.loaded} abortTracking={this.abortTracking} title={Wording.MOVIE} shouldLoad={this.state.shouldLoad} type="movie" filter="categories" />
                        </div>
                        <VideoListView cate="COMIC" list={this.state.listComic} onVideoSelect={this.onVideoSelect} />
                        <div>
                            <div className="o-category-banner w-component-card banner5" onClick={this.clickBanner.bind(this, 'comic', 'categories=神魔')}></div>
                            <div className="o-category-banner w-component-card banner6" onClick={this.clickBanner.bind(this, 'comic', 'categories=loli')}></div>
                            <FilterSectionView title={Wording.COMIC} shouldLoad={this.state.shouldLoad} type="comic" filter="categories" />
                        </div>
                        <VideoListView cate="VARIETY" list={this.state.listVariety} onVideoSelect={this.onVideoSelect} />
                        <div>
                            <div className="o-category-banner w-component-card banner7" onClick={this.clickBanner.bind(this, 'variety', 'categories=访谈')}></div>
                            <div className="o-category-banner w-component-card banner8" onClick={this.clickBanner.bind(this, 'variety', 'categories=选秀')}></div>
                            <FilterSectionView title={Wording.VARIETY} shouldLoad={this.state.shouldLoad} type="variety" filter="categories" />
                        </div>
                        <FooterView />
                    </div>
                );
            }
        });

        return IndexPage;
    });
}(this));
