var App;
(function (App) {
    var Layout;
    (function (Layout) {
        var Controllers;
        (function (Controllers) {
            var NavigationCtrl = (function () {
                function NavigationCtrl($location) {
                    this.$location = $location;
                }
                NavigationCtrl.prototype.isActive = function (viewLocation) {
                    return (viewLocation === this.$location.path());
                };
                ;
                NavigationCtrl.$inject = ['$location'];
                return NavigationCtrl;
            }());
            App.getAppContainer()
                .getSection('app')
                .getInstance()
                .controller('NavigationCtrl', NavigationCtrl);
        })(Controllers = Layout.Controllers || (Layout.Controllers = {}));
    })(Layout = App.Layout || (App.Layout = {}));
})(App || (App = {}));
//# sourceMappingURL=navigationCtrl.js.map