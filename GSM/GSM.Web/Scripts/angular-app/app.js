var App;
(function (App) {
    var app = new App.Framework.App();
    app.bootstrap(function () {
        var section = new App.Framework.AppSection('app', []);
        app.addSection(section, true);
    });
    function getAppContainer() {
        return app;
    }
    App.getAppContainer = getAppContainer;
    config.$inject = ['$locationProvider'];
    function config($locationProvider) {
        $locationProvider.html5Mode(true);
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }
    App.getAppContainer()
        .getSection('app')
        .getInstance()
        .config(config);
})(App || (App = {}));
//# sourceMappingURL=app.js.map