var App;
(function (App) {
    var Widgets;
    (function (Widgets) {
        var section = new App.Framework.AppSection('app.widgets', [
            'ngSanitize',
            'ui.bootstrap',
            'ui.grid',
            'ui.grid.moveColumns',
            'ui.grid.pagination',
            'ui.grid.resizeColumns',
            'ui.grid.selection'
        ]);
        App.getAppContainer().addSection(section);
        section.getInstance()
            .controller("SelectModalCtrl", Widgets.SelectModalCtrl);
    })(Widgets = App.Widgets || (App.Widgets = {}));
})(App || (App = {}));
//# sourceMappingURL=widgetsSection.js.map