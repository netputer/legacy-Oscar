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

        var CommentItem = React.createClass({
            render : function () {
                return (
                    <li>
                        <div>{this.props['data-comment'].name}</div>
                        <div>{this.props['data-comment'].time}</div>
                        <div>{this.props['data-comment'].content}</div>
                    </li>
                );
            }
        });

        var CommentaryView = React.createClass({
            render : function () {
                var commentsList = _.map(comments, function (comment) {
                    return <CommentItem data-comment={comment} />;
                });

                return (
                    <div>
                        <span>评论</span>
                        <ul>{commentsList}</ul>
                    </div>
                );
            }
        });

        return CommentaryView;
    });
}(this));
