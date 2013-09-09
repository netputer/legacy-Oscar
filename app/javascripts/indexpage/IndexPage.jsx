/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        'IO',
        'Actions',
        'Wording',
        'mixins/FilterNullValues',
        'components/searchbox/SearchBoxView',
        'components/VideoListView',
        'components/FilterSectionView'
    ], function (
        React,
        IO,
        Actions,
        Wording,
        FilterNullValues,
        SearchBoxView,
        VideoListView,
        FilterSectionView
    ) {

        var queryAsync = function (type) {
            var deferred = $.Deferred();

            IO.requestAsync({
                url : Actions.actions.SEARCH,
                data : {
                    content_type : type,
                    max : 10,
                    rank_type : 'hot'
                },
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
                }
            },
            componentDidMount : function () {
                queryAsync('tv').done(function (resp) {
                    this.setState({
                        listTv : resp.videoList
                    });
                }.bind(this));

                queryAsync('movie').done(function (resp) {
                    this.setState({
                        listMovie : resp.videoList
                    });
                }.bind(this));

                queryAsync('comic').done(function (resp) {
                    this.setState({
                        listComic : resp.videoList
                    });
                }.bind(this));

                queryAsync('variety').done(function (resp) {
                    this.setState({
                        listVariety : resp.videoList
                    });
                }.bind(this));
            },
            onSearchAction : function (query) {
                $('<a>').attr({
                    href : 'search.html#q/' + query
                })[0].click();
            },
            onVideoSelect : function (id) {
                window.location.hash = '#detail/' + id;
            },
            render : function () {
                return (
                    <div class="o-ctn">
                        <SearchBoxView
                            class="o-search-box-ctn"
                            onAction={this.onSearchAction} />
                        <VideoListView cate={Wording.TV} list={this.state.listTv} onVideoSelect={this.onVideoSelect} />
                        <div>
                            <div class="o-category-banner w-component-card"></div>
                            <div class="o-category-banner w-component-card"></div>
                            <FilterSectionView title={Wording.REGION} type="tv" filter="areas" />
                        </div>
                        <VideoListView cate={Wording.MOVIE} list={this.state.listMovie} onVideoSelect={this.onVideoSelect} />
                        <div>
                            <div class="o-category-banner w-component-card"></div>
                            <div class="o-category-banner w-component-card"></div>
                            <FilterSectionView title={Wording.MOVIE} type="movie" filter="categories" />
                        </div>
                        <VideoListView cate={Wording.COMIC} list={this.state.listComic} onVideoSelect={this.onVideoSelect} />
                        <div>
                            <div class="o-category-banner w-component-card"></div>
                            <div class="o-category-banner w-component-card"></div>
                            <FilterSectionView title={Wording.COMIC} type="comic" filter="categories" />
                        </div>
                        <VideoListView cate={Wording.VARIETY} list={this.state.listVariety} onVideoSelect={this.onVideoSelect} />
                        <div>
                            <div class="o-category-banner w-component-card"></div>
                            <div class="o-category-banner w-component-card"></div>
                            <FilterSectionView title={Wording.VARIETY} type="variety" filter="categories" />
                        </div>
                    </div>
                );
            }
        });

        return IndexPage;
    });
}(this));
