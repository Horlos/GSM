var App;
(function (App) {
    var Manage;
    (function (Manage) {
        var Directives;
        (function (Directives) {
            var SvRestrictWhenDirective = (function () {
                function SvRestrictWhenDirective() {
                    this.restrict = 'A';
                }
                SvRestrictWhenDirective.instance = function () {
                    return new SvRestrictWhenDirective();
                };
                SvRestrictWhenDirective.prototype.link = function (scope, element, attributes) {
                    var fnrestrict = scope.$parent.$eval(attributes.svRestrictWhen);
                    scope.isRestricted = true;
                    scope.$parent.$watch(attributes.ngModel, function (a) {
                        element.attr('disabled', fnrestrict(a));
                    });
                };
                return SvRestrictWhenDirective;
            }());
            App.getAppContainer()
                .getSection('app.manage')
                .getInstance()
                .directive('svRestrictWhen', SvRestrictWhenDirective.instance);
        })(Directives = Manage.Directives || (Manage.Directives = {}));
    })(Manage = App.Manage || (App.Manage = {}));
})(App || (App = {}));
//# sourceMappingURL=svRestrictWhenDirective.js.map