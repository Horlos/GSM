var App;
(function (App) {
    var Instruments;
    (function (Instruments) {
        var section = new App.Framework.AppSection('app.instruments', [
            'common',
            'common.logger',
            'app.services',
            'app.widgets',
            'ui.grid.autoFitColumns'
        ]);
        App.getAppContainer().addSection(section);
    })(Instruments = App.Instruments || (App.Instruments = {}));
})(App || (App = {}));
//# sourceMappingURL=instrumentsSection.js.map