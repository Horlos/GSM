var App;
(function (App) {
    var Framework;
    (function (Framework) {
        var AppSection = (function () {
            function AppSection(name, dependencies) {
                this.name = name;
                this.dependencies = dependencies;
            }
            AppSection.prototype.register = function (rootSection) {
                this.module = angular.module(this.name, this.dependencies);
                if (rootSection !== undefined) {
                    angular.module(rootSection).requires.push(this.name);
                }
            };
            AppSection.prototype.getInstance = function () {
                return angular.module(this.name);
            };
            return AppSection;
        }());
        Framework.AppSection = AppSection;
    })(Framework = App.Framework || (App.Framework = {}));
})(App || (App = {}));
//# sourceMappingURL=appSections.js.map