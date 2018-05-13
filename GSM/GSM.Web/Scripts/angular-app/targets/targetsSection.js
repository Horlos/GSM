var App;
(function (App) {
    var Targets;
    (function (Targets) {
        var section = new App.Framework.AppSection("app.targets", [
            'ui.bootstrap.tooltip',
            'ui.grid.autoFitColumns',
            'common',
            'common.logger',
            'app.services',
            'app.widgets'
        ]);
        App.getAppContainer().addSection(section);
    })(Targets = App.Targets || (App.Targets = {}));
})(App || (App = {}));
//# sourceMappingURL=targetsSection.js.map