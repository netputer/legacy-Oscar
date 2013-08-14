require.config({
    paths : {
        $ : '../components/jquery/jquery',
        _ : '../components/underscore/underscore',
        react : '../components/react/react'
    },
    shim : {
        _ : {
            deps : [],
            exports : '_'
        }
    }
});

(function (window, document) {
    require(['react', 'components/HeaderView'], function (React, HeaderView) {
        React.renderComponent(HeaderView({}), document.body);
    });
}(this, document));
