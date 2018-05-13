var App;
(function (App) {
    var Common;
    (function (Common) {
        var Exception;
        (function (Exception) {
            var ExceptionHandlerProvider = (function () {
                function ExceptionHandlerProvider() {
                }
                ExceptionHandlerProvider.prototype.configure = function (appErrorPrefix) {
                    this.config = {
                        appErrorPrefix: appErrorPrefix
                    };
                };
                ExceptionHandlerProvider.prototype.$get = function () {
                    return this.config;
                };
                return ExceptionHandlerProvider;
            }());
            config.$inject = ['$provide'];
            function config($provide) {
                $provide.decorator('$exceptionHandler', extendExceptionHandler);
            }
            extendExceptionHandler.$inject = ['$delegate', 'exceptionHandler', 'logger'];
            function extendExceptionHandler($delegate, exceptionHandler, logger) {
                return function (exception, cause) {
                    var appErrorPrefix = exceptionHandler.config.appErrorPrefix || '';
                    var errorData = { exception: exception, cause: cause };
                    exception.message = appErrorPrefix + exception.message;
                    $delegate(exception, cause);
                    logger.error(exception.message, errorData);
                };
            }
            App.getAppContainer()
                .getSection('common.exception')
                .getInstance()
                .provider('exceptionHandler', ExceptionHandlerProvider)
                .config(config);
        })(Exception = Common.Exception || (Common.Exception = {}));
    })(Common = App.Common || (App.Common = {}));
})(App || (App = {}));
//# sourceMappingURL=exceptionHandlerProvider.js.map