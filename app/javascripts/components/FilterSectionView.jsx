/** @jsx React.DOM */
(function (window) {
    define([
        '_',
        'React',
        'GA',
        'Actions',
        'mixins/FilterNullValues',
        'utilities/QueryHelper'
    ], function (
        _,
        React,
        GA,
        Actions,
        FilterNullValues,
        QueryHelper
    ) {

        var loaded = {
            tv : false,
            movie : false,
            comic : false,
            variety : false
        };

        var date = new Date().getTime();
        var timeStamps = {
            tv : date,
            movie : date,
            comic : date,
            variety : date
        };

        var deferreds = {
            tv : QueryHelper.queryTypeAsync('tv'),
            movie : QueryHelper.queryTypeAsync('movie'),
            comic : QueryHelper.queryTypeAsync('comic'),
            variety : QueryHelper.queryTypeAsync('variety')
        };

        var FilterSectionView = React.createClass({
            getInitialState : function () {
                return {
                    list : []
                };
            },
            componentWillReceiveProps : function (nextProps) {
                if (nextProps.shouldLoad[nextProps.type] && !loaded[nextProps.type]) {
                    loaded[nextProps.type] = true;
                    deferreds[nextProps.type].done(function (resp) {

                        var date = new Date().getTime();
                        setTimeout(function (){
                            GA.log({
                                'metric' : 'api_load_time_success_filter_' + nextProps.type,
                                'timeSpent' : date - timeStamps[nextProps.type]
                            });
                        }, 0);

                        this.setState({
                            list : resp[nextProps.filter]
                        });
                        nextProps.load && nextProps.load();
                    }.bind(this)).fail(function () {

                        var date = new Date().getTime();
                        setTimeout(function (){
                            GA.log({
                                'metric' : 'api_load_time_error_filter_' + nextProps.type,
                                'timeSpent' : date - timeStamps[nextProps.type]
                            });
                        }, 0);

                        nextProps.abortTracking && nextProps.abortTracking('loadComplete');
                    });
                }
            },
            clickItem : function (cate) {
                GA.log({
                    'event' : 'video.common.action',
                    'action' : 'filter_clicked',
                    'type' : this.props.filter,
                    'keyword' : cate.name,
                    'pos' : 'homepage',
                    'mode' : 'view'
                });

                $('<a>').attr({
                      href : 'cate.html?' + this.props.filter + '=' + cate.name + '#' + this.props.type
                })[0].click();
            },
            render : function () {
                var filters = _.map(this.state.list, function (item) {
                    return <li key={item.id} className="link o-filter-section-item" onClick={this.clickItem.bind(this, item)}>{item.name}</li>
                }, this);

                return (
                    <div className="o-filter-section-ctn w-component-card w-text-info">
                        <h5 className="title w-text-secondary">{this.props.title}分类</h5>
                        <ul className="filters-ctn">
                        {filters}
                        </ul>
                    </div>
                );
            }
        });

        return FilterSectionView;
    });
}(this));
