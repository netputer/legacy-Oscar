/*global define*/
/**
 * @author wangye.zhao@wandoujia.com
 * @doc https://github.com/wandoulabs/engineering-documents/wiki/%5BClient%5D-Account.js
 */
(function (window) {
    define([
        'Backbone',
        '$',
        'IOBackendDevice',
        'Actions'
    ], function (
        Backbone,
        $,
        IO,
        Actions
    ) {
        console.log('Account - File loaded.');

        var Account = Backbone.Model.extend({
            SINA : 'sina',
            QZONE : 'qzone',
            RENREN : 'renren',
            TQQ : 'tqq',
            QQ : 'QQ',
            defaults : {
                isLogin : false,
                auth : '',
                uid : '',
                userName : '',
                userMail : '',
                userAvatar : '',
                platforms : {}
            },
            initialize : function () {
                IO.requestAsync(Actions.actions.ACCOUNT_INFO).done(function (resp) {
                    if (resp.state_code === 200) {
                        this.changeHandler(resp.body);
                    }
                }.bind(this));
            },
            loginAsync : function (title, source, platform) {
                var deferred = $.Deferred();

                if (!this.get('isLogin')) {
                    if (platform) {
                        platform = (platform === this.TQQ || platform === this.QZONE) ? this.QQ : platform;
                    }

                    IO.requestAsync({
                        url : Actions.actions.ACCOUNT_LOGIN,
                        data : {
                            title : title || '',
                            source : source || '',
                            platform : platform || ''
                        },
                        success : function (resp) {
                            if (resp.state_code === 200) {
                                deferred.resolve(resp);
                            } else {
                                deferred.reject(resp);
                            }
                        }
                    });
                } else {
                    deferred.resolve();
                }

                return deferred.promise();
            },
            changeHandler : function (accountInfo) {
                if (accountInfo.auth) {
                    var member = accountInfo.member;
                    var platforms = {};
                    platforms[this.SINA] = member.activesina !== undefined && parseInt(member.activesina, 10) !== 0;
                    platforms[this.QZONE] = member.activeqq !== undefined && parseInt(member.activeqq, 10) !== 0;
                    platforms[this.TQQ] = member.activeqq !== undefined && parseInt(member.activeqq, 10) !== 0;
                    platforms[this.RENREN] = member.activerenren !== undefined && parseInt(member.activerenren, 10) !== 0;

                    this.set({
                        auth : accountInfo.auth,
                        uid : member.uid,
                        userName : member.username,
                        userMail : member.email,
                        userAvatar : member.avatar,
                        isLogin : true,
                        platforms : platforms
                    });
                } else {
                    this.set(this.defaults);
                }
            }
        });

        var account = new Account();

        IO.Backend.Device.onmessage({
            'data.channel' : Actions.events.ACCOUNT_STATE_CHANGE
        }, function (msg) {
            account.changeHandler(msg);
        });

        return account;
    });
}(this));
