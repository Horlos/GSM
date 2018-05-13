namespace App.Framework {
    export interface ISection {
        name: string;
        dependencies: string[];

        register(rootSection?: string): void;
        getInstance(): ng.IModule;
    }

    export interface ISectionConfig {
        config: Function;
    }

    export class AppSection implements ISection {
        private module: ng.IModule;

        constructor(public name: string,
            public dependencies: string[]) {
        }

        register(rootSection?: string): void {
            this.module = angular.module(this.name, this.dependencies);
            if (rootSection !== undefined) {
                angular.module(rootSection).requires.push(this.name);
            }
        }

        getInstance(): ng.IModule {
            return angular.module(this.name);
        }
    }
}