/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        'IO',
        'Actions',
        'Wording',
        'main/Log',
        'mixins/Performance',
        'mixins/FilterNullValues',
        'utilities/QueryString',
        'utilities/QueryHelper',
        'utilities/FormatDate',
        'components/searchbox/SearchBoxView',
        'components/VideoListView',
        'personpage/PersonPageRouter',
        'components/FooterView'
    ], function (
        React,
        IO,
        Actions,
        Wording,
        Log,
        Performance,
        FilterNullValues,
        QueryString,
        QueryHelper,
        FormatDate,
        SearchBoxView,
        VideoListView,
        PersonPageRouter,
        FooterView
    ) {
        var PAGE_SIZE = 10;

        var personId = QueryString.get('id') || '';

        var personName = QueryString.get('name') || '';

        var personPageRouter = PersonPageRouter.getInstance();

        var PersonPage = React.createClass({
            mixins : [Performance],
            getInitialState : function () {
                return {
                    person : {},
                    works : [],
                    start : 0,
                    total : 0,
                    intro_length : 150
                };
            },
            componentWillMount : function () {
                this.initPerformance('person', 2, personId);
            },
            componentDidMount : function () {
                if (personId) {
                    QueryHelper.queryPersonAsync(parseInt(personId)).done(function (resp) {
                        if (resp.personBean.name) {
                            this.setState({
                                person : resp
                            });
                            this.loaded();

                            QueryHelper.queryWorksAsync(resp.personBean.name, this.state.start, 12).done(function (res) {
                                if (res.total > 0) {
                                    this.setState({
                                        total : res.total,
                                        start : res.video ? res.video.length : 0,
                                        works : res.videoList
                                    });
                                }
                                this.loaded();
                            }.bind(this));
                        }

                    }.bind(this));
                } else if (personName) {
                    QueryHelper.queryPersonAsync(personName).done(function (resp) {
                        resp = resp[0];
                        if (resp.personBean.name) {
                            this.setState({
                                person : resp
                            });
                            this.loaded();

                            QueryHelper.queryWorksAsync(resp.personBean.name, this.state.start, 12).done(function (res) {
                                if (res.total > 0) {
                                    this.setState({
                                        total : res.total,
                                        start : res.video ? res.video.length : 0,
                                        works : res.videoList
                                    });
                                }
                                this.loaded();
                            }.bind(this));
                        }

                    }.bind(this));
                }
            },
            loadMoreWorks : function (name) {
                if (this.state.start < this.state.total) {
                    QueryHelper.queryWorksAsync(name, this.state.start, this.state.total-this.state.start).done(function (res) {
                        if (res.total > 0) {
                            this.setState({
                                total : res.total,
                                works : res.videoList
                            });
                        }
                    }.bind(this));
                }
            },
            onSearchAction : function (query) {
                if (query.trim().length) {
                    $('<a>').attr({
                        href : 'search.html?q=' + query
                    })[0].click();
                }
            },
            onVideoSelect : function (id) {
                this.setTimeStamp(new Date().getTime(), id);
                window.location.hash = '#detail/' + id;
            },
            toggleShowIntro : function () {
                if (this.state.intro_length !== Infinity) {
                    $('.intro').css('max-height', '10000px');
                }
                this.setState({
                    intro_length : this.state.intro_length === Infinity ? 150 : Infinity
                });
            },
            getMoreIntro : function (intro) {
                if (intro && intro.length < 150) {
                    return <span />
                }
                if (intro && intro.length > this.state.intro_length) {
                    return <a className="w-text-info more-intro" href="javascript:void(0)" onClick={this.toggleShowIntro}>{Wording.MORE}<i></i></a>
                } else if (intro && intro.length < this.state.intro_length) {
                    return <a className="w-text-info more-intro collapse" href="javascript:void(0)" onClick={this.toggleShowIntro}>{Wording.COLLAPSE}<i></i></a>
                }
            },
            getLoadMoreBtn : function (name) {
                if (this.state.total > 5 && this.state.total > this.state.works.length) {
                    return <a href="javascript:void(0)" className="w-btn load-more" onClick={this.loadMoreWorks.bind(this, name)}>{Wording.LOAD_MORE}</a>
                }
            },
            render : function () {
                var person = this.state.person.personBean || {};
                var coverStyle = {};
                if (person.coverUrl) {
                    coverStyle = {
                        'background-image' : 'url(' + person.coverUrl + ')'
                    };
                }
                
                return (
                    <div className="o-ctn">
                        <SearchBoxView
                            className="o-search-box-ctn"
                            onAction={this.onSearchAction}
                            source="person" />
                        <div className="w-wc person">
                            <h3>{person.name}</h3>
                            <div className="person-cover" style={coverStyle} />
                            <div className="person-info">
                                <p className="w-text-thirdly">
                                    {FormatDate('yyyy-MM-dd', person.birthDate)}
                                </p>
                                <p className="w-text-thirdly">
                                    {person.birthPlace}
                                </p>
                                <p className="w-text-thirdly">
                                    {person.jobs ? person.jobs.join(' / ') : ''}<br />
                                </p>
                                <p className="w-text-thirdly intro">
                                    {person.introduction && person.introduction.length > this.state.intro_length ? person.introduction.substr(0, this.state.intro_length) + '...' : person.introduction}
                                </p>
                                {this.getMoreIntro(person.introduction)}
                            </div>
                        </div>
                        <div className="w-wc person-works">
                            <VideoListView cate="VIDEO_WORKS" noBigItem="true" list={this.state.works} onVideoSelect={this.onVideoSelect} />
                            {this.getLoadMoreBtn(person.name)}
                        </div>
                        <FooterView />
                    </div>
                );
            }
        });

        return PersonPage;
    });
}(this));
