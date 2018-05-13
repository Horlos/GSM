namespace App {
    var app = new Framework.App();
    app.bootstrap(() => {
        let section = new Framework.AppSection('app', []);
        app.addSection(section, true);
    });

    export function getAppContainer(): Framework.IApp {
        return app;
    }

    config.$inject = ['$locationProvider'];
    function config($locationProvider: ng.ILocationProvider): void {
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

}