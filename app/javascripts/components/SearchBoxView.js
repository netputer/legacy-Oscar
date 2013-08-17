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

        var SuggestionListView = React.createClass({displayName: 'SuggestionListView',
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
                    return React.DOM.li( {onClick: this.clickItem,  dangerouslySetInnerHTML:{ __html : word }})
                }, this);

                return (
                    lists.length > 0 ? React.DOM.ul(null,  lists ) : React.DOM.ul( {style:{ display : 'none'}})
                );
            }
        });

        var SearchboxView = React.createClass({displayName: 'SearchboxView',
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
                    React.DOM.div( {className:"o-search-box w-form-inline"}, 
                        React.DOM.input( {type:"text", className:"w-form-inline", onChange: this.changeInput,  onKeyDown: this.keypressInput }),
                        React.DOM.button( {className:"w-btn w-btn-primary"}, "搜索"),
                        SuggestionListView( {'data-list':this.state.list} )
                    )
                );
            }
        });

        return SearchboxView;
    });
}(this));
