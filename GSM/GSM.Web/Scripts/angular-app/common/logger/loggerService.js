var App;
(function (App) {
    var Common;
    (function (Common) {
        var Logger;
        (function (Logger_1) {
            (function (LogLevel) {
                LogLevel[LogLevel["Debug"] = 0] = "Debug";
                LogLevel[LogLevel["Info"] = 1] = "Info";
            })(Logger_1.LogLevel || (Logger_1.LogLevel = {}));
            var LogLevel = Logger_1.LogLevel;
            var Exception = (function () {
                function Exception(message) {
                    this.message = message;
                }
                return Exception;
            }());
            Logger_1.Exception = Exception;
            var Logger = (function () {
                function Logger() {
                    this.logLevel = LogLevel.Debug;
                }
                Logger.prototype.log = function (message) {
                    console.log(message);
                };
                Logger.prototype.debug = function (message) {
                    if (this.logLevel === LogLevel.Debug) {
                        console.debug(message);
                    }
                };
                Logger.prototype.info = function (message) {
                    console.info(message);
                };
                Logger.prototype.error = function (exception) {
                    console.error(exception.message);
                };
                return Logger;
            }());
            Logger_1.Logger = Logger;
            App.getAppContainer()
                .getSection('common.logger')
                .getInstance()
                .service('logger', Logger);
        })(Logger = Common.Logger || (Common.Logger = {}));
    })(Common = App.Common || (App.Common = {}));
})(App || (App = {}));
//# sourceMappingURL=loggerService.js.map