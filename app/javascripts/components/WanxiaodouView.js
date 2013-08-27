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

        var WanxiaodouView = React.createClass({displayName: 'WanxiaodouView',
            render : function () {

                var index = _.random(0, 46);
                var className = 'wanxiaodou ' + wanxiaodou[index];
                var tip = this.props['data-tip'];
                var type = this.props['data-type'];

                tip = FormatString(this.type[type], [tip]);

                return (
                    React.DOM.div( {className:"o-wanxiaodou-container"}, 
                        React.DOM.div( {className:className}),
                        React.DOM.span( {className:"wanxiaodou-tip w-text-info", dangerouslySetInnerHTML:{__html : tip}})
                    )
                );
            },
            type : {
                'NO_SEARCH_RESULT' : '没有找到关于「<em>{0}</em>」的视频呢。'
            }
        });

        return WanxiaodouView;
    });
}(this));
