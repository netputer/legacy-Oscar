require.config({
    paths : {
        $ : '../components/jquery/jquery',
        _ : '../components/underscore/underscore',
        Backbone : '../components/backbone/backbone',
        React : '../components/react/react-with-addons',
        $R : '../components/reactive/reactive'
    },
    shim : {
        $ : {
            deps : [],
            exports : '$'
        },
        _ : {
            deps : [],
            exports : '_'
        },
        $R : {
            deps : [],
            exports : '$R'
        },
        Backbone : {
            deps : ['$', '_'],
            exports : 'Backbone'
        }
    }
});

if (window.OneRingRequest === undefined) {
    window.OneRingRequest = window.OneRingStreaming = function () {
        return;
    };
}
