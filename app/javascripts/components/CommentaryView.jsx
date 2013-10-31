/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        'utilities/FormatDate',
        'Wording'
    ], function (
        React,
        _,
        FormatDate,
        Wording
    ) {
        var CommentItem = React.createClass({
            render : function () {
                return (
                    <li className="item">
                        <div className="author w-text-info">{this.props.comment.author}</div>
                        <div className="date w-text-info">{FormatDate('yyyy-MM-dd', this.props.comment.date)}</div>
                        <div className="w-text-secondary">{this.props.comment.comment}</div>
                    </li>
                );
            }
        });

        var CommentaryView = React.createClass({
            render : function () {
                var commentsList = _.map(this.props.comments, function (comment, i) {
                    return <CommentItem comment={comment} key={i} />;
                });
                if (commentsList.length > 0) {
                    return (
                        <div>
                            <h5>{Wording.COMMENT}</h5>
                            <ul className="o-comment-list">{commentsList}</ul>
                        </div>
                    );
                } else {
                    return (
                        <div>
                            <h5>{Wording.COMMENT}</h5>
                            <h6 className="w-text-info">{Wording.NO_DATA}</h6>
                        </div>
                    );
                }
            }
        });

        return CommentaryView;
    });
}(this));
