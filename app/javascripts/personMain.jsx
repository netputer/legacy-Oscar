/** @jsx React.DOM */
/*global define*/
(function (window, document) {
    define([
        'React',
        'Backbone',
        'IO',
        'GA',
        'main/Log',
        'Actions',
        'utilities/QueryHelper',
        'personpage/PersonPageRouter',
        'personpage/PersonPage',
        'components/SeriesDetailPanelView',
        'components/DeclarationView'
    ], function (
        React,
        Backbone,
        IO,
        GA,
        Log,
        Actions,
        QueryHelper,
        PersonPageRouter,
        PersonPage,
        SeriesDetailPanelView,
        DeclarationView
    ) {
        var personPageRouter = PersonPageRouter.getInstance();

        var closeDetailPanel = function () {
            seriesDetailPanelView.setState({
                show : false
            });

            personPageRouter.navigate('#keep', {
                trigger : false
            });
        };

        var seriesDetailPanelView = <SeriesDetailPanelView closeDetailPanel={closeDetailPanel} />

        personPageRouter.on('route:detail', function (id) {
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
            } else {
                seriesDetailPanelView.setState({
                    show : false
                });
            }

            Log.pageShow();

        });

        React.renderComponent(
            <div>
                <PersonPage />
                {seriesDetailPanelView}
                <DeclarationView />
            </div>
        , document.body);

        Backbone.history.start();

        $('body').on('keydown', function (evt) {
            if (evt.keyCode === 27) {
                closeDetailPanel();
            }
        });
    });
}(this, this.document));
