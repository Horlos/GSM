var App;
(function (App) {
    var SynthesisRequests;
    (function (SynthesisRequests) {
        var section = new App.Framework.AppSection("app.synthesisRequests", [
            'ngResource',
            'ngFileSaver',
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
    })(SynthesisRequests = App.SynthesisRequests || (App.SynthesisRequests = {}));
})(App || (App = {}));
//# sourceMappingURL=synthesisRequestSection.js.map