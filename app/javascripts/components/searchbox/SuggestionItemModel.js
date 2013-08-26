(function (window) {
    define([
        'Backbone'
    ], function (Backbone) {
        var SuggestionItemModel = Backbone.Model.extend({
            defaults : {
                highlight : false
            }
        });

        return SuggestionItemModel;
    });
}(this));
