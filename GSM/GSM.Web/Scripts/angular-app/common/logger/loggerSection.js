var App;
(function (App) {
    var Common;
    (function (Common) {
        var Logger;
        (function (Logger) {
            var section = new App.Framework.AppSection('common.logger', []);
            App.getAppContainer().addSection(section);
        })(Logger = Common.Logger || (Common.Logger = {}));
    })(Common = App.Common || (App.Common = {}));
})(App || (App = {}));
//# sourceMappingURL=loggerSection.js.map