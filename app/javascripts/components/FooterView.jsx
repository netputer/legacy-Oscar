/** @jsx React.DOM */
(function (window) {
    define([
        'React'
    ], function (
        React
    ) {
        var FooterView = React.createClass({
            render : function () {
                return (
                    <footer class="o-footer w-text-info">
                        <p>
                            &copy; 2010 - 2013 豌豆实验室<br />
                            除非特别注明，视频由第三方提供，豌豆荚仅根据您的指令提供搜索结果链接，与出处无关
                        </p>
                    </footer>
                );
            }
        });

        return FooterView;
    });
}(this));
