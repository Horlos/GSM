namespace App.Common.Logger {
    export interface ILogger {
        log(message: string): void;
        debug(message: string): void;
        info(message: string): void;
        error(exception: IException): void;
    }

    export interface IException {
        message: string;
    }

    export enum LogLevel {
        Debug,
        Info
    }

    export class Exception implements IException {
        constructor(public message: string) {}
    }

    export class Logger implements ILogger {
        private logLevel: LogLevel;

        constructor() {
            this.logLevel = LogLevel.Debug;
        }

        log(message: string): void {
            console.log(message);
        }

        debug(message: string): void {
            if (this.logLevel === LogLevel.Debug) {
                console.debug(message);    
            }
        }

        info(message: string): void {
            console.info(message);
        }

        error(exception: IException): void {
            console.error(exception.message);
        }
    }

    App.getAppContainer()
        .getSection('common.logger')
        .getInstance()
        .service('logger', Logger);
}