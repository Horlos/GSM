var App;
(function (App) {
    var Common;
    (function (Common) {
        var Router;
        (function (Router) {
            var section = new App.Framework.AppSection('common.router', [
                'ngRoute',
                'common.logger'
            ]);
            App.getAppContainer().addSection(section);
        })(Router = Common.Router || (Common.Router = {}));
    })(Common = App.Common || (App.Common = {}));
})(App || (App = {}));
//# sourceMappingURL=routerSection.js.map