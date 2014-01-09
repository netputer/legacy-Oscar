/*global define*/
(function (window) {
    define([], function () {
        var ClientInfo = {
        	getVersion : function () {
        		return	parseFloat(navigator.userAgent.split(' ')[navigator.userAgent.split(' ').length-1].substr(0, 4));
        	}
        };

        return ClientInfo;
    });
}(this));
