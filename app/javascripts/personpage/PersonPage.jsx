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
        'components/FilterView',
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
        FilterView,
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
                    total : 0
                };
            },
            componentWillMount : function () {
                this.initPerformance('person', 2, personId);
            },
            componentDidMount : function () {
                if (personId) {
                    QueryHelper.queryPersonAsync(parseInt(personId)).done(function (resp) {
                        console.log(resp)
                        if (resp.personBean.name) {
                            this.setState({
                                person : resp
                            });

                            QueryHelper.queryWorksAsync(resp.personBean.name, this.state.start, 12).done(function (res) {
                                console.log(res.videoList)
                                if (res.total > 0) {
                                    this.setState({
                                        total : res.total,
                                        start : res.video ? res.video.length : 0,
                                        works : res.videoList
                                    });
                                }
                            }.bind(this));
                        }

                    }.bind(this));
                } else if (personName) {
                    QueryHelper.queryPersonAsync(personName).done(function (resp) {
                        console.log(resp)
                        resp = resp[0];
                        if (resp.personBean.name) {
                            this.setState({
                                person : resp
                            });

                            QueryHelper.queryWorksAsync(resp.personBean.name, this.state.start, 12).done(function (res) {
                                console.log(res.videoList)
                                if (res.total > 0) {
                                    this.setState({
                                        total : res.total,
                                        start : res.video ? res.video.length : 0,
                                        works : res.videoList
                                    });
                                }
                            }.bind(this));
                        }

                    }.bind(this));
                }
            },
            loadMoreWorks : function (name) {
                if (this.state.start < this.state.total) {
                    QueryHelper.queryWorksAsync(name, this.state.start, this.state.total-this.state.start).done(function (res) {
                        console.log(res.videoList)
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
                            <h2>{person.name}</h2>
                            <div className="person-cover" style={coverStyle} />
                            <div className="person-info">
                                <p className="w-text-thirdly">
                                    {Wording.GENDER[person.gender]}{Wording.COMMA}
                                    {Wording.BIRTH_AT + FormatDate('yyyy-MM-dd', person.birthDate)}{Wording.COMMA}
                                    {Wording.FROM + person.birthPlace}
                                </p>
                                <p className="w-text-thirdly">
                                    {person.jobs ? person.jobs.join(' / ') : ''}<br />
                                </p>
                                <p className="w-text-thirdly">
                                    {person.introduction}
                                </p>
                                <a className="w-text-secondary more-intro" href="javascript:void(0)">{Wording.MORE}<i>V</i></a>
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
