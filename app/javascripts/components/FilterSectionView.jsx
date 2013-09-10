/** @jsx React.DOM */
(function (window) {
    define([
        '_',
        'React',
        'IO',
        'Actions',
        'mixins/FilterNullValues'
    ], function (
        _,
        React,
        IO,
        Actions,
        FilterNullValues
    ) {

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
            componentDidMount : function () {
                queryAsync(this.props.type).done(function (resp) {
                    this.setState({
                        list : resp[this.props.filter]
                    });
                }.bind(this));
            },
            clickItem : function (cate) {
                $('<a>').attr({
                      href : 'cate.html?' + this.props.filter + '=' + cate.name + '#' + this.props.type
                })[0].click();
            },
            render : function () {
                var filters = _.map(this.state.list, function (item) {
                    return <li key={item.id} class="link o-filter-section-item" onClick={this.clickItem.bind(this, item)}>{item.name}</li>
                }, this);

                return (
                    <div class="o-filter-section-ctn w-component-card w-text-info">
                        <h5 class="title w-text-secondary">{this.props.title}分类</h5>
                        <ul class="filters-ctn">
                        {filters}
                        </ul>
                    </div>
                );
            }
        });

        return FilterSectionView;
    });
}(this));
