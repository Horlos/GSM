namespace App.Common.Exception {
    export interface IExceptionHandlerConfig {
        appErrorPrefix: string;
    }
    export interface IExceptionHandlerProvider {
        configure(appErrorPrefix: string): void;
    }

    class ExceptionHandlerProvider implements ng.IServiceProvider, IExceptionHandlerProvider {
        config: IExceptionHandlerConfig;

        configure(appErrorPrefix: string): void {
            this.config = {
                appErrorPrefix: appErrorPrefix
            }
        }

        $get(): IExceptionHandlerConfig {
            return this.config;
        }
    }

    config.$inject = ['$provide'];
    function config($provide) {
        $provide.decorator('$exceptionHandler', extendExceptionHandler);
    }

    extendExceptionHandler.$inject = ['$delegate', 'exceptionHandler', 'logger'];
    function extendExceptionHandler($delegate, exceptionHandler, logger) {
        return (exception, cause) => {
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
}