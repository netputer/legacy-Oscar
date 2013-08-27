(function (window) {
    define([
        '_'
    ], function (
        _
    ) {
        var FilterNullValues = {
            filterNullVlaues : function (input) {
                var k;
                for (k in input) {
                    if (input.hasOwnProperty(k)) {
                        if (input[k] === undefined || input[k] === null) {
                            delete input[k];
                        } else if (typeof input[k] === 'object') {
                            input[k] = this.filterNullVlaues(input[k]);
                        }
                    }
                }
                return input;
            }
        };
        return FilterNullValues;
    });
}(this));
