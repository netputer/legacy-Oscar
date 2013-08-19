/** @jsx React.DOM */
(function (window) {
    define([
        '$',
        '_',
        'React',
        'utilities/KeyMapping'
    ], function (
        $,
        _,
        React,
        KeyMapping
    ) {

        var queryAsync = function (keyword) {
            var deferred = $.Deferred();

            $.ajax({
                url : 'http://oscar.wandoujia.com/api/v1/search/suggest/' + keyword,
                success : deferred.resolve,
                error : deferred.reject
            });

            return deferred.promise();
        };

        var SuggestionListView = React.createClass({
            getDefaultProps : function () {
                return {
                    'data-list' : []
                }
            },
            clickItem : function (evt) {
                console.log(evt.target.innerHTML);
            },
            render : function () {
                var lists = _.map(this.props['data-list'], function (word) {
                    return <li onClick={ this.clickItem } dangerouslySetInnerHTML={{ __html : word }}></li>
                }, this);

                return (
                    lists.length > 0 ? <ul>{ lists }</ul> : <ul style={{ display : 'none'}}></ul>
                );
            }
        });

        var SearchboxView = React.createClass({
            getInitialState : function () {
                return {
                    list : []
                };
            },
            changeInput : function (evt) {
                queryAsync(evt.target.value).done(function (resp) {
                    this.setState({
                        list : resp
                    });
                }.bind(this));
            },
            keypressInput : function (evt) {
                if (KeyMapping.ESC === evt.keyCode) {
                    this.setState({
                        list : []
                    });
                }
            },
            render : function () {
                return (
                    <div class="o-search-box w-form-inline">
                        <input type="text" class="w-form-inline" onChange={ this.changeInput } onKeyDown={ this.keypressInput }/>
                        <button class="w-btn w-btn-primary">搜索</button>
                        <SuggestionListView data-list={this.state.list} />
                    </div>
                );
            }
        });

        return SearchboxView;
    });
}(this));
