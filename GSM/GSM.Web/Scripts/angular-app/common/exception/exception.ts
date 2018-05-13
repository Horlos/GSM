namespace App.Common.Exception {
    import Logger = App.Common.Logger.ILogger;

    export interface IException {
        catcher(message: string): (reason: any) => void;
    }

    class Exception implements IException {
        static $inject = ['logger'];
        constructor(
            private logger: Logger) {
        }

        catcher(message: string) {
            return (reason) => {
                this.logger.error(reason);
            }
        }
    }

    factory.$inject = ['logger'];
    function factory(logger) {
        return new Exception(logger);
    }

    App.getAppContainer()
        .getSection('common.exception')
        .getInstance()
        .factory('exception', factory);
}