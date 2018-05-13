var App;
(function (App) {
    var Dashboard;
    (function (Dashboard) {
        var section = new App.Framework.AppSection('app.dashboard', [
            'ngResource',
            'angular.filter',
            'angularMoment',
            'common'
        ]);
        App.getAppContainer().addSection(section);
    })(Dashboard = App.Dashboard || (App.Dashboard = {}));
})(App || (App = {}));
//# sourceMappingURL=dashboardSection.js.map