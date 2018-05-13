var App;
(function (App) {
    var Strands;
    (function (Strands) {
        var section = new App.Framework.AppSection('app.strands', [
            'ngResource',
            'ngFileUpload',
            'LocalStorageModule',
            'ui.router',
            'ui.bootstrap.contextMenu',
            'ui.bootstrap',
            'ui.grid',
            'ui.grid.pagination',
            'ui.grid.resizeColumns',
            'ui.grid.selection',
            'ui.grid.autoFitColumns',
            'common',
            'common.logger',
            'app.services',
            'app.widgets'
        ]);
        App.getAppContainer().addSection(section);
    })(Strands = App.Strands || (App.Strands = {}));
})(App || (App = {}));
//# sourceMappingURL=strandsSection.js.map