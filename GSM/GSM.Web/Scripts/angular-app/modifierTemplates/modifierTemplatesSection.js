var App;
(function (App) {
    var ModifierTemplates;
    (function (ModifierTemplates) {
        var section = new App.Framework.AppSection('app.modifierTemplates', [
            'ui.bootstrap.contextMenu',
            'ui.bootstrap',
            'ui.grid.autoFitColumns',
            'common',
            'common.logger',
            'app.services',
            'app.widgets'
        ]);
        App.getAppContainer().addSection(section);
    })(ModifierTemplates = App.ModifierTemplates || (App.ModifierTemplates = {}));
})(App || (App = {}));
//# sourceMappingURL=modifierTemplatesSection.js.map