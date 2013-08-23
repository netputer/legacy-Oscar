/** @jsx React.DOM */
(function (window) {
    define([
        'React',
        '_',
        'Backbone'
    ], function (
        React,
        _,
        Backbone
    ) {
        var DescriptionView = React.createClass({displayName: 'DescriptionView',
            render : function () {
                
                var description = this.props.data['description'];
                return (
                    React.DOM.div( {className:"o-episodes-list-container"}, 
                    React.DOM.p( {className:"w-text-secondary"}, "描述"),
                    React.DOM.p( {className:"description w-text-info"}, description)
                    )
                );
            }
        });

        return DescriptionView;
    });
}(this));