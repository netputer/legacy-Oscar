/** @jsx React.DOM */
/*global define*/
(function (window) {
    define([
        'React',
        '_',
        'Wording',
        'GA',
        'main/DownloadHelper',
        'utilities/FormatString'
    ], function (
        React,
        _,
        Wording,
        GA,
        DownloadHelper,
        FormatString
    ) {
        var ElementsGenerator = {
            clickButtonDownload : function (source) {
                DownloadHelper.download(this.props.video.get('videoEpisodes'));

                GA.log({
                    'event' : 'video.download.action',
                    'action' : 'btn_click',
                    'pos' : source,
                    'video_id' : this.props.video.id,
                    'video_source' : this.props.video.get('videoEpisodes')[0].downloadUrls[0].providerName
                });
            },
            getProviderEle : function () {
                var text = this.props.video.get('providerNames').join(' / ');
                return <span class="provider w-wc w-text-info">{Wording.PROVIDERNAMES_LABEL + (text || Wording.INTERNET)}</span>
            },
            getDownloadBtn : function (source) {
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

                return <button class="button-download w-btn w-btn-primary" onClick={this.clickButtonDownload.bind(this, source)}>{text}</button>
            },
            getActorsEle : function () {
                var text = '';
                var video = this.props.video;
                if (video.get('type') === 'VARIETY') {
                    text = Wording.PRESENTER_LABEL + video.get('presenters');
                } else {
                    text = Wording.ACTORS_LABEL + video.get('actors');
                }

                return <div class="actors w-text-secondary w-wc">{text}</div>;
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

                return <div class="w-text-secondary w-wc">{text}</div>;
            },
            getRatingEle : function () {
                var ele;
                var data = this.props.video.toJSON();
                if (data.rating !== Wording.NO_RATING) {
                    ele = <span class="h4">{data.rating}</span>;
                } else {
                    ele = data.rating;
                }

                return <div class="w-text-secondary w-wc">{Wording.RATING_LABEL}{ele}</div>;
            }
        };

        return ElementsGenerator;
    });
}(this));
