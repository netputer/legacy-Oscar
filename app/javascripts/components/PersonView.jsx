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


        var PersonView = React.createClass({
            onClick : function (id) {
                if (id) {
                    $('<a>').attr({
                        href : 'person.html?id=' + id
                    })[0].click();
                }
            },
            getPersonList : function () {
                return _.map(this.props.persons, function (p) {
                    var person = p.personBean;
                    var coverStyle = {};

                    if (person.coverUrl) {
                        coverStyle = {
                            'background-image' : 'url(' + person.coverUrl + ')'
                        };
                    }

                    return (
                        <li className="o-list-item w-hbox person w-component-card" onClick={this.onClick.bind(this, person.id)}>
                            <div className="o-mask item-cover" style={coverStyle} />
                            <div className="info">
                                <h4>{person.name}</h4>
                                <span className="title w-wc w-text-secondary">{person.jobs.join(' / ')}</span>
                                <span className="actors w-wc w-text-info">{p.productCount.videos ? p.productCount.videos + Wording.VIDEO_WORKS : ''}</span>
                                <span className="episode w-wc w-text-info">{person.introduction}</span>
                                <button className="w-btn w-btn-primary w-btn-mini" onClick={this.onClick.bind(this, person.id)}>{Wording.VIEW}</button>
                            </div>
                        </li>
                    );
                }.bind(this));
            },
            render : function () {
                if (this.props.persons.length > 0) {
                    return (
                        <div className="o-person-result-ctn">
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
