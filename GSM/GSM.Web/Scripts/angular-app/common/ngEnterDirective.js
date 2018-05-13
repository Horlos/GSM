var App;
(function (App) {
    var Dashboard;
    (function (Dashboard) {
        var Directives;
        (function (Directives) {
            var NgEnterDirective = (function () {
                function NgEnterDirective() {
                    this.restrict = 'A';
                }
                NgEnterDirective.instance = function () {
                    return new NgEnterDirective();
                };
                NgEnterDirective.prototype.link = function (scope, element, attributes) {
                    element.bind("keydown keypress", function (event) {
                        if (event.which === 13) {
                            scope.$apply(function () {
                                scope.$eval(attributes.ngEnter);
                            });
                            event.preventDefault();
                        }
                    });
                };
                return NgEnterDirective;
            }());
            App.getAppContainer()
                .getSection('common')
                .getInstance()
                .directive('ngEnter', NgEnterDirective.instance);
        })(Directives = Dashboard.Directives || (Dashboard.Directives = {}));
    })(Dashboard = App.Dashboard || (App.Dashboard = {}));
})(App || (App = {}));
//# sourceMappingURL=ngEnterDirective.js.map