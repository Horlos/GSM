var App;
(function (App) {
    var Common;
    (function (Common) {
        var apf = App.Framework;
        App.getAppContainer().addSection(new apf.AppSection('common', ['common.logger', 'toastr']));
    })(Common = App.Common || (App.Common = {}));
})(App || (App = {}));
//# sourceMappingURL=commonSection.js.map