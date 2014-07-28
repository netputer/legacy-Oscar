/** @jsx React.DOM */
/*global define*/
(function (window, document) {
    define([
        'React',
        'Backbone',
        'IO',
        'GA',
        'Actions',
        'main/Log',
        'utilities/QueryHelper',
        'catepage/CatePage',
        'catepage/CatePageRouter',
        'components/DownloadTipView',
        'components/DeclarationView',
        'components/SeriesDetailPanelView'
    ], function (
        React,
        Backbone,
        IO,
        GA,
        Actions,
        Log,
        QueryHelper,
        CatePage,
        CatePageRouter,
        DownloadTipView,
        DeclarationView,
        SeriesDetailPanelView
    ) {
        var catePageRouter = CatePageRouter.getInstance();

        var closeDetailPanel = function () {
            seriesDetailPanelView.setState({
                show : false
            });
        
            catePageRouter.navigate(window.location.hash.split('/')[0], {
                trigger : false
            });
        };

        var declarationView = <DeclarationView />
        var seriesDetailPanelView = <SeriesDetailPanelView closeDetailPanel={closeDetailPanel} />

        React.renderComponent((
            <div>
                <CatePage />
                {seriesDetailPanelView}
                <DownloadTipView />
                <DeclarationView />
            </div>
        ), document.body);

        catePageRouter.on('route:filter', function (cate, id) {
            if (id) {
                seriesDetailPanelView.setState({
                    show : true,
                    loading : true,
                    subscribed : -2
                });

                QueryHelper.queryAsync(id).done(function (resp) {
                    seriesDetailPanelView.setProps({
                        origin : resp,
                        id : id
                    });

                    if (seriesDetailPanelView.isMounted()) {
                        seriesDetailPanelView.setState({
                            loading : false
                        });
                    }
                });

                Log.pageShow();
            } else {
                seriesDetailPanelView.setState({
                    show : false
                });
            }
        });

        Backbone.history.start();
        Log.pageShow();

        $('body').on('keydown', function (evt) {
            if (evt.keyCode === 27) {
                closeDetailPanel();
            }
        });
    });
}(this, this.document));
