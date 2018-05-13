namespace App.Services {
    export interface ILookupService {
        get(): ng.IPromise<any>;
        getTable(tableName: string): ng.IPromise<any>;
    }

    class LookupService implements ILookupService {
        static $inject = ['$http', 'logger'];
        constructor(private $http: ng.IHttpService, private logger: App.Common.Logger.Logger) {
        }

        get(): ng.IPromise<any> {
            let url = "/api/lookup";
            let data = { table: ['Targets', 'Orientations', 'SpeciesList', 'ModStructures'] };
            var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.get({ params: data })
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }

        getTable(tableName: string): ng.IPromise<any> {
            let url = "/api/lookup";
            let data = { table: [tableName] };
            var dataSource = new App.Common.DataProvider.AngularDataSource(url, this.$http);
            return dataSource.get({ params: data })
                .then((response) => {
                    return response.data;
                })
                .catch((error) => {
                    let exception = new App.Common.Logger.Exception(error);
                    this.logger.error(exception);
                });
        }
    }

    App.getAppContainer()
        .getSection('app.services')
        .getInstance()
        .service('lookupService', LookupService);
}