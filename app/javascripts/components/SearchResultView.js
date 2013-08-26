/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        'components/WanxiaodouView'
    ], function (
        React,
        WanxiaodouView
    ) {
        var queryAsync = function (keyword) {
            var deferred = $.Deferred();

            $.ajax({
                url : 'http://oscar.wandoujia.com/api/v1/search/' + keyword,
                success : deferred.resolve,
                error : deferred.reject
            });

            return deferred.promise();
        };

        var SearchResultView = React.createClass({displayName: 'SearchResultView',
            getInitialState : function () {
                return {
                    list : [],
                    keyword : this.props.keyword
                };
            },
            doSearch : function (keyword) {
                queryAsync(keyword).done(function (resp) {
                    this.setState({
                        list : resp.videoList || [],
                        keyword : keyword
                    });
                }.bind(this));
            },
            render : function () {
                if (this.state.list.length > 0) {
                    return React.DOM.div(null);
                } else {
                    return WanxiaodouView( {'data-tip':this.state.keyword, 'data-type':"NO_SEARCH_RESULT"} );
                }
            }
        });

        return SearchResultView;
    });
}(this));
