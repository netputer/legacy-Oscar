/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        'Backbone',
        'utilities/FormatString'
    ], function (
        React,
        _,
        Backbone,
        FormatString
    ) {

        var wanxiaodou = [
            'apple', 'babypea', 'bigtalker', 'businessface', 'cheers',
            'cold', 'coolcats', 'crawl', 'ecstatic', 'foodie',
            'forfood', 'furious', 'googlyeyes', 'grannypea', 'grateful',
            'hallo', 'hellokitty', 'hothothot', 'hugitout', 'hugthecat',
            'karaokestar', 'lookaway', 'lookinggood', 'loveit', 'ohreeeeally',
            'partytime', 'peekabo', 'phoneoverboard', 'reading', 'secretive',
            'showersong', 'showertime', 'sleepypea', 'smooch', 'sogreat',
            'steaming', 'struckbylightening', 'strut', 'stumped', 'suspicious',
            'sweetpea', 'tearsofjoy', 'theend', 'threekitties', 'tickles',
            'wahaha', 'yes'
        ];

        var TYPE = {
            NO_SEARCH_RESULT : '没有找到关于「<em>{0}</em>」的视频呢。',
            NO_VIDEO : '没有符合条件的视频'
        };

        var WanxiaodouView = React.createClass({
            getDefaultProps : function () {
                return {
                    'data-tip' : ''
                };
            },
            render : function () {
                var index = _.random(0, 46);
                var className = 'wanxiaodou ' + wanxiaodou[index];
                var tip = this.props['data-tip'];
                var type = this.props['data-type'];

                tip = FormatString(TYPE[type], [tip]);

                return (
                    <div class="o-wanxiaodou-container">
                        <div class={className}></div>
                        <span class="wanxiaodou-tip w-text-info" dangerouslySetInnerHTML={{__html : tip}}></span>
                    </div>
                );
            }
        });

        return WanxiaodouView;
    });
}(this));
