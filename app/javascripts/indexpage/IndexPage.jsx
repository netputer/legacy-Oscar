/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        'IO',
        'Actions',
        'mixins/FilterNullValues',
        'components/searchbox/SearchBoxView',
        'components/VideoListView',
        'components/FilterSectionView'
    ], function (
        React,
        IO,
        Actions,
        FilterNullValues,
        SearchBoxView,
        VideoListView,
        FilterSectionView
    ) {

        var CATE = {
            tv : '电视剧',
            movie : '电影',
            comic : '动漫',
            variety : '综艺'
        };

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
            onSearchAction : function () {

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
                        <VideoListView cate={CATE['tv']} list={this.state.listTv} onVideoSelect={this.onVideoSelect} />
                        <div>
                            <div class="o-category-banner w-component-card"></div>
                            <div class="o-category-banner w-component-card"></div>
                            <FilterSectionView title="地区" type="tv" filter="areas" />
                        </div>
                        <VideoListView cate={CATE['movie']} list={this.state.listMovie} onVideoSelect={this.onVideoSelect} />
                        <div>
                            <div class="o-category-banner w-component-card"></div>
                            <div class="o-category-banner w-component-card"></div>
                            <FilterSectionView title="电影" type="movie" filter="categories" />
                        </div>
                        <VideoListView cate={CATE['comic']} list={this.state.listComic} onVideoSelect={this.onVideoSelect} />
                        <div>
                            <div class="o-category-banner w-component-card"></div>
                            <div class="o-category-banner w-component-card"></div>
                            <FilterSectionView title="动漫" type="comic" filter="categories" />
                        </div>
                        <VideoListView cate={CATE['variety']} list={this.state.listVariety} onVideoSelect={this.onVideoSelect} />
                        <div>
                            <div class="o-category-banner w-component-card"></div>
                            <div class="o-category-banner w-component-card"></div>
                            <FilterSectionView title="综艺" type="variety" filter="categories" />
                        </div>
                    </div>
                );
            }
        });

        return IndexPage;
    });
}(this));
