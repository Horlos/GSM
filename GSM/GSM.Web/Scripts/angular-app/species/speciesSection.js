var App;
(function (App) {
    var Species;
    (function (Species) {
        var section = new App.Framework.AppSection('app.species', [
            'ui.bootstrap.tooltip',
            'ui.grid.autoFitColumns',
            'common',
            'common.logger',
            'app.services',
            'app.widgets'
        ]);
        App.getAppContainer().addSection(section);
    })(Species = App.Species || (App.Species = {}));
})(App || (App = {}));
//# sourceMappingURL=speciesSection.js.map