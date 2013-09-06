/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        '_',
        'Wording',
        'main/DownloadHelper'
    ], function (
        React,
        _,
        Wording,
        DownloadHelper
    ) {
        var ElementsGenerator = {
            clickButtonDownload : function () {
                DownloadHelper.download(this.props.video.get('videoEpisodes'));
            },
            getDownloadBtn : function () {
                var text = '';
                console.log(this.props.video.get('type'))
                switch (this.props.video.get('type')) {
                case 'MOVIE':
                    text = Wording.DOWNLOAD;
                    break;
                case 'TV':
                case 'VARIETY':
                case 'COMIC':
                    text = Wording.DOWNLOAD_ALL;
                    break;
                }

                return <button class="button-download w-btn w-btn-primary" onClick={this.clickButtonDownload}>{text}</button>
            }
        };

        return ElementsGenerator;
    });
}(this));
