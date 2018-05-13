var App;
(function (App) {
    var Common;
    (function (Common) {
        var Exception;
        (function (Exception_1) {
            var Exception = (function () {
                function Exception(logger) {
                    this.logger = logger;
                }
                Exception.prototype.catcher = function (message) {
                    var _this = this;
                    return function (reason) {
                        _this.logger.error(reason);
                    };
                };
                Exception.$inject = ['logger'];
                return Exception;
            }());
            factory.$inject = ['logger'];
            function factory(logger) {
                return new Exception(logger);
            }
            App.getAppContainer()
                .getSection('common.exception')
                .getInstance()
                .factory('exception', factory);
        })(Exception = Common.Exception || (Common.Exception = {}));
    })(Common = App.Common || (App.Common = {}));
})(App || (App = {}));
//# sourceMappingURL=exception.js.map