(function (window) {
    define(['$'], function ($) {
        var $flashPlugin = $('<embed style="display: none" type="application/x-shockwave-flash" />');
        var $player = $('<div>').addClass('o-player-ctn').append($flashPlugin);

        var VideoPlayer = function () {
            return {
                show : function (url) {
                    var $iframe = $('<iframe>').addClass('frame');
                    var $iframeCtn = $('<div>').addClass('frame-ctn').append($iframe);
                    $player.append($iframeCtn);

                    $iframe.attr('src', url);
                    $('body').append($player);

                    this.isShow = true;
                },
                close : function () {
                    $player.detach();
                    $player.empty();

                    this.isShow = false;
                }
            };
        };

        return new VideoPlayer();
    });
}(this));
