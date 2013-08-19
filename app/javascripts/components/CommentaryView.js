/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_'
    ], function (
        React,
        _
    ) {
        var comments = [{
            name : '首页',
            content : '1',
            time : new Date().getTime()
        }, {
            name : '首页',
            content : '2',
            time : new Date().getTime()
        }, {
            name : '首页',
            content : '3',
            time : new Date().getTime()
        }, {
            name : '首页',
            content : '4',
            time : new Date().getTime()
        }];

        var CommentItem = React.createClass({displayName: 'CommentItem',
            render : function () {
                return (
                    React.DOM.li(null, 
                        React.DOM.div(null, this.props['data-comment'].name),
                        React.DOM.div(null, this.props['data-comment'].time),
                        React.DOM.div(null, this.props['data-comment'].content)
                    )
                );
            }
        });

        var CommentaryView = React.createClass({displayName: 'CommentaryView',
            render : function () {
                var commentsList = _.map(comments, function (comment) {
                    return CommentItem( {'data-comment':comment} );
                });

                return (
                    React.DOM.div(null, 
                        React.DOM.span(null, "评论"),
                        React.DOM.ul(null, commentsList)
                    )
                );
            }
        });

        return CommentaryView;
    });
}(this));
