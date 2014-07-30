/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        '$',
        'Wording'
    ], function (
        React,
        _,
        $,
        Wording
    ) {

        var PictureView = React.createClass({
            render : function () {
                return (
                    <ul className="thumb-container w-hbox">
                    {this.renderItems()}
                    </ul>
                );
            },
            renderItems : function () {
                var pictures = this.props.data || [];
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

        var PersonView = React.createClass({
            onClick : function (id) {
                if (id) {
                    $('<a>').attr({
                        href : 'person.html?id=' + id
                    })[0].click();
                }
            },
            getPersonList : function () {
                return _.map(this.props.persons, function (person) {
                    var coverStyle = {};

                    if (person.coverUrl) {
                        coverStyle = {
                            'background-image' : 'url(' + person.coverUrl + ')'
                        };
                    }

                    return (
                        <li className="o-list-item w-hbox person w-component-card">
                            <div className="o-mask item-cover" style={coverStyle} onClick={this.onClick.bind(this, person.id)} />
                            <div className="info-container">
                                <h4 className="title" onClick={this.onClick.bind(this, person.id)}>{person.name}</h4>
                                <p className="jobs w-wc w-text-thirdly">{person.jobs.join(' / ')}</p>
                                <p className="works-count w-wc w-text-thirdly">{person.productCount.video ? person.productCount.video + Wording.VIDEO_WORKS_WITH_NUMBER : ''}</p>
                                <p className="introduction w-wc w-text-thirdly">{person.introduction && person.introduction.length > 40 ? person.introduction.substr(0, 40) + '...' : Wording.NO_DATA}</p>
                                <button className="w-btn w-btn-primary" onClick={this.onClick.bind(this, person.id)}>{Wording.VIEW}</button>
                            </div>
                            <PictureView data={person.albumsUrls} />
                        </li>
                    );
                }.bind(this));
            },
            noSelectedFilter : function (filters) {
                return !filters.type && !filters.areas && !filters.years && filters.rank === 'rel';
            },
            render : function () {
                if (this.props.persons.length > 0 && this.noSelectedFilter(this.props.filterSelected) && this.props.current === 1) {
                    return (
                        <div className="o-person-result-ctn">
                            <h4 className="search-title w-text-secondary">{Wording.PERSON}</h4>
                            <ul>{this.getPersonList()}</ul>
                        </div>
                    );
                } else {
                    return <div className="o-person-result-ctn" />;
                }
            }
        });

        return PersonView;
    });
}(this));
