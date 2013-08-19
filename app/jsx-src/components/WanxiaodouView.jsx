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

        var WanxiaodouView = React.createClass({
            render : function () {

                var index = _.random(0, 46),
                    className = 'o-wanxiaodou ' + wanxiaodou[index],
                    tip = this.props['data-tip'],
                    type = this.props['data-type'];

                tip = FormatString(this.type[type], [tip]);

                return (
                    <div class="o-wanxiaodou-container">
                        <div class={className}></div>
                        <span class="o-tip" dangerouslySetInnerHTML={{__html : tip}}></span>
                    </div>
                );
            },
            type : {
                'NO_SEARCH_RESULT' : '没有找到关于「<em>{0}</em>」的视频呢。'
            }
        });

        return WanxiaodouView;
    });
}(this));

