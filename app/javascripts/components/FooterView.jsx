/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        'IO'
    ], function (
        React,
        IO
    ) {
        var FooterView = React.createClass({
            clickInstall : function () {
                IO.requestAsync({
                    url : 'wdj://window/publish.json',
                    data : {
                        channel : 'web.navigate',
                        value : JSON.stringify({
                            type : 'market',
                            id : 'http://apps.wandoujia.com/special/player'
                        })
                    }
                });
            },
            render : function () {
                return (
                    <footer class="o-footer w-text-info">
                        <p>
                            &copy; 2010 - 2013 豌豆实验室<br />
                            除非特别注明，视频由第三方提供，豌豆荚仅根据您的指令提供搜索结果链接，与出处无关
                        </p>
                        <p>如果遇到视频无法播放，请尝试 <span class="link" onClink={this.clickInstall}>安装播放器</span></p>
                    </footer>
                );
            }
        });

        return FooterView;
    });
}(this));
