/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '$',
        'IO',
        'GA',
        'Wording'
    ], function (
        React,
        $,
        IO,
        GA,
        Wording
    ) {

        var DownloadTipView = React.createClass({
            render : function () {
                var style = {
                    opacity : 0
                };

                return (
                    <div className="download-tip" style={style}>
                        {Wording.TASK_BEGIN}, {Wording.SOURCE_FROM + ' '}<span className="source-from"></span>
                    </div>
                );
            }
        });
        return DownloadTipView;
    });
}(this));
