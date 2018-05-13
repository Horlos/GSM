var App;
(function (App) {
    var Services;
    (function (Services) {
        var section = new App.Framework.AppSection("app.services", ['common.logger']);
        App.getAppContainer().addSection(section);
    })(Services = App.Services || (App.Services = {}));
})(App || (App = {}));
//# sourceMappingURL=servicesSection.js.map