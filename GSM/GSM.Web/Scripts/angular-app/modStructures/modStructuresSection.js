var App;
(function (App) {
    var ModStructures;
    (function (ModStructures) {
        var section = new App.Framework.AppSection("app.modStructures", [
            'ui.bootstrap',
            'ui.bootstrap.tooltip',
            'ui.grid.autoFitColumns',
            'colorpicker.module',
            'ngFileUpload',
            'common',
            'common.logger',
            'app.services',
            'app.widgets'
        ]);
        App.getAppContainer().addSection(section);
    })(ModStructures = App.ModStructures || (App.ModStructures = {}));
})(App || (App = {}));
//# sourceMappingURL=modStructuresSection.js.map