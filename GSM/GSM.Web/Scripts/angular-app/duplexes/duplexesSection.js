var App;
(function (App) {
    var Duplexes;
    (function (Duplexes) {
        var section = new App.Framework.AppSection('app.duplexes', [
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
            //'ui.grid.pinning',
            //'ui.grid.expandable',
            //'ui.grid.autoResize',
            //'ui.grid.grouping',
            'common',
            'common.logger',
            'app.services',
            'app.widgets'
        ]);
        App.getAppContainer().addSection(section);
    })(Duplexes = App.Duplexes || (App.Duplexes = {}));
})(App || (App = {}));
//# sourceMappingURL=duplexesSection.js.map