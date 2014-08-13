/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '$',
        'IO',
        'GA',
        'Actions',
        'Wording'
    ], function (
        React,
        $,
        IO,
        GA,
        Actions,
        Wording
    ) {

        var getBannerAsync = function (type) {

            var deferred = $.Deferred();

            IO.requestAsync({
                url : Actions.actions.TABS,
                data : {
                    type : type
                },
                success : deferred.resolve,
                error : deferred.reject
            });

            return deferred.promise();
        };


        var BannerView = React.createClass({
           getInitialState : function () {
                return {
                    tabs :  []
                };
            },
            componentWillMount : function () {
                getBannerAsync().done(function(resp) {
                    this.setState({
                        tabs : resp
                    });
                }.bind(this));
            },
            clickBanner : function (action) {
                if (action.type === 'OPEN_URL') {
                    $('<a>').attr({
                        href : action.url
                    })[0].click();
                }
            },
            renderItem : function () {
                return _.map(this.state.tabs, function (item) {
                    if (item.alias === this.props.source && item.banners) {
                        var banner = item.banners[0];
                        var imageUrl = banner.imageUrl;
                        var style = {
                            'background-image' : 'url(' + imageUrl + ')'
                        };

                        return (
                            <div className="banner-item" style={style} onClick={this.clickBanner.bind(this, banner.defaultAction)} />
                        );
                    }
                }, this);
            },
            render : function () {
                return (
                    <div className="banner">
                        {this.renderItem()}
                    </div>
                );
            }
        });

        return BannerView;
    });
}(this));
