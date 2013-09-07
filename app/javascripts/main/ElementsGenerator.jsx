/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        '_',
        'Wording',
        'main/DownloadHelper',
        'utilities/FormatString'
    ], function (
        React,
        _,
        Wording,
        DownloadHelper,
        FormatString
    ) {
        var ElementsGenerator = {
            clickButtonDownload : function () {
                DownloadHelper.download(this.props.video.get('videoEpisodes'));
            },
            getDownloadBtn : function () {
                var text = '';
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
            },
            getCateEle : function () {
                var text = '';
                var data = this.props.video.toJSON();
                switch (this.props.video.get('type')) {
                case 'VARIETY':
                    text = data.categories;
                    break;
                case 'TV':
                case 'MOVIE':
                case 'COMIC':
                    text = data.categories + ' / ' + FormatString(Wording.YEAR, data.year);
                    break;
                }

                return <div class="w-text-info w-wc">{text}</div>;
            },
            getRatingEle : function () {
                var ele;
                var data = this.props.video.toJSON();
                if (data.rating !== Wording.NO_RATING) {
                    ele = <span class="h4">{data.rating}</span>;
                } else {
                    ele = data.rating;
                }

                return <div class="w-text-info w-wc">{Wording.RATING_LABEL}{ele}</div>;
            }
        };

        return ElementsGenerator;
    });
}(this));