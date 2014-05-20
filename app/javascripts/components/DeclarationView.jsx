/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '$',
        'IO',
        'GA',
        'Wording',
        'mixins/PopupView'
    ], function (
        React,
        $,
        IO,
        GA,
        Wording,
        PopupView
    ) {

        var DeclarationView = React.createClass({
            mixins : [PopupView],
            render : function () {
                if (this.state.show) {
                    $('body').toggleClass('overflow', this.state.show);

                    return (
                        <div className="declaration popup dark-bg">
                            <div className="popup-window">
                                <h2 className="w-text-secondary">声明</h2>
                                <p className="w-text-thirdly">你将开始使用豌豆荚的视频服务。</p>
                                <p className="w-text-thirdly">继续使用表明你同意豌豆荚关于视频搜索、播放和缓存功能的声明。</p>
                                <p className="w-text-info">点击查看<a href="http://www.wandoujia.com/mobile/video_legal.html" target="_default">声明全文</a></p>
                                <button className="w-btn w-btn-primary" onClick={this.hidePopup}>同意并继续</button>
                            </div>
                        </div>
                    );
                } else {
                    return (
                        <div></div>
                    );
                }
            }
        });
        return DeclarationView;
    });
}(this));
