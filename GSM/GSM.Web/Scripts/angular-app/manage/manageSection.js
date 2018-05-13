var App;
(function (App) {
    var Manage;
    (function (Manage) {
        var section = new App.Framework.AppSection('app.manage', [
            'ngResource',
            'ui.bootstrap',
            'common',
            'common.logger',
            'app.widgets'
        ]);
        App.getAppContainer().addSection(section);
    })(Manage = App.Manage || (App.Manage = {}));
})(App || (App = {}));
//# sourceMappingURL=manageSection.js.map