var App;
(function (App) {
    var Common;
    (function (Common) {
        var EnumExtensions = (function () {
            function EnumExtensions() {
            }
            EnumExtensions.getNamesAndValues = function (e) {
                return this.getNames(e).map(function (n) { return { name: n, value: e[n] }; });
            };
            EnumExtensions.getNames = function (e) {
                return this.getObjValues(e).filter(function (v) { return typeof v === "string"; });
            };
            EnumExtensions.getValues = function (e) {
                return this.getObjValues(e).filter(function (v) { return typeof v === "number"; });
            };
            EnumExtensions.getObjValues = function (e) {
                return Object.keys(e).map(function (k) { return e[k]; });
            };
            return EnumExtensions;
        }());
        Common.EnumExtensions = EnumExtensions;
    })(Common = App.Common || (App.Common = {}));
})(App || (App = {}));
//# sourceMappingURL=enumExtensions.js.map