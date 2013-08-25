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
        var DescriptionView = React.createClass({
            render : function () {

                var description = this.props.data['description'];
                return (
                    <div class="o-episodes-list-container">
                    <p class="w-text-secondary">描述</p>
                    <p class="description w-text-info">{description}</p>
                    </div>
                );
            }
        });

        return DescriptionView;
    });
}(this));
