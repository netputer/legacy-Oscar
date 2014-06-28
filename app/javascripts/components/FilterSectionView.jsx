/** @jsx React.DOM */
(function (window) {
    define([
        '_',
        'React',
        'IO',
        'GA',
        'Actions',
        'mixins/FilterNullValues'
    ], function (
        _,
        React,
        IO,
        GA,
        Actions,
        FilterNullValues
    ) {

        var loaded = {
                tv : false,
                movie : false,
                comic : false,
                variety : false
            };

        var queryAsync = function (type) {
            var deferred = $.Deferred();

            IO.requestAsync({
                url : Actions.actions.QUERY_TYPE,
                data : {
                    type : type
                },
                success : deferred.resolve,
                error : deferred.reject
            });

            return deferred.promise();
        };

        var FilterSectionView = React.createClass({
            getInitialState : function () {
                return {
                    list : []
                }
            },
            componentWillReceiveProps : function (nextProps) {
                if (nextProps.shouldLoad[nextProps.type] && !loaded[nextProps.type]) {
                    loaded[nextProps.type] = true;
                    queryAsync(nextProps.type).done(function (resp) {
                        this.setState({
                            list : resp[nextProps.filter]
                        });
                        nextProps.load();
                    }.bind(this));
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
